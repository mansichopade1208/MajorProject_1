
import { Router } from "express";
import multer from "multer";
import { extractPdfText } from "../utils/pdfParser.js";
import { z } from "zod";

import ConsultationReport from "../models/ConsultationReport.js";
import { generateFinalReport } from "../services/finalReportAI.js";

const router = Router();

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const MAX_TEXT_LENGTH = 5000;
const MAX_EXTRACTED_TEXT = 100000;

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES,
        fields: 2,
        fieldSize: MAX_TEXT_LENGTH * 4,
    },
    fileFilter: (req, file, callback) => {
        const isPdfName = file.originalname
            .toLowerCase()
            .endsWith(".pdf");

        const isPdfMime =
            file.mimetype === "application/pdf" ||
            file.mimetype === "application/octet-stream";

        if (!isPdfName || !isPdfMime) {
            return callback(new Error("Only PDF files are allowed."));
        }

        callback(null, true);
    },
});

const submissionSchema = z
    .object({
        interviewSummary: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
        medicalHistory: z.string().trim().max(MAX_TEXT_LENGTH),
    })
    .strict();

router.post(
    "/submit",
    upload.array("medicalDocuments", MAX_FILES),
    async (req, res) => {
        try {
            const validation = submissionSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid interview summary and medical history.",
                });
            }

            const { interviewSummary, medicalHistory } = validation.data;
            const files = req.files || [];

            const documents = [];

            for (const file of files) {
                // Basic PDF signature check.
                if (file.buffer.subarray(0, 5).toString() !== "%PDF-") {
                    return res.status(400).json({
                        success: false,
                        message: `The file "${file.originalname}" is not a valid PDF.`,
                    });
                }

                let extractedText;

                try {
                    extractedText = await extractPdfText(file.buffer);
                } catch (error) {
                    console.error(
                        `PDF extraction failed for ${file.originalname}:`,
                        error
                    );

                    return res.status(400).json({
                        success: false,
                        message: `Could not read "${file.originalname}". Please upload a valid PDF.`,
                    });
                }

                documents.push({
                    fileName: file.originalname,
                    text: extractedText.slice(0, MAX_EXTRACTED_TEXT),
                });
            }

            const finalReport = await generateFinalReport({
                interviewSummary,
                medicalHistory,
                documents,
            });

            // Save only the generated report, not raw source information.
            const savedReport = await ConsultationReport.create({
                finalReport,
            });

            return res.status(201).json({
                success: true,
                message: "Final consultation report generated successfully.",
                data: {
                    reportId: savedReport._id,
                    finalReport: savedReport.finalReport,
                    createdAt: savedReport.createdAt,
                },
            });
        } catch (error) {
            if (error instanceof multer.MulterError) {
                const isTooLarge = error.code === "LIMIT_FILE_SIZE";
                const isTooManyFiles = error.code === "LIMIT_FILE_COUNT";

                return res.status(400).json({
                    success: false,
                    message: isTooLarge
                        ? "Each PDF must be 10 MB or smaller."
                        : isTooManyFiles
                            ? "You can upload a maximum of 5 PDFs."
                            : "The uploaded files could not be processed.",
                });
            }

            if (
                error?.message === "Only PDF files are allowed."
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message,
                });
            }

            console.error("Final consultation submission failed:", error);

            return res.status(502).json({
                success: false,
                message: "Unable to generate the final report. Please try again.",
            });
        }
    }
);

export default router;
