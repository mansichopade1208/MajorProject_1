
import { Router } from "express";
import { z } from "zod";
import { generateNextQuestion } from "../services/healthInterviewAI.js";

const router = Router();

// ==================== REQUEST VALIDATION ====================

const interviewSchema = z
  .object({
    initialComplaint: z.string().trim().min(1).max(2000),

    messages: z
      .array(
        z
          .object({
            role: z.enum(["user", "assistant"]),
            content: z.string().trim().min(1).max(2000),
          })
          .strict()
      )
      .min(1)
      .max(20),

    language: z
      .enum([
        "en",
        "hi",
        "gu",
        "mr",
        "bn",
        "ta",
        "te",
        "kn",
        "ml",
        "pa",
      ])
      .default("en"),
  })
  .strict();

// ==================== GENERATE NEXT QUESTION ====================

router.post("/next", async (req, res) => {
  const validation = interviewSchema.safeParse(req.body);

  if (!validation.success) {
    console.error(
      "Health interview validation error:",
      validation.error.flatten()
    );

    return res.status(400).json({
      success: false,
      message: "Please provide valid interview messages.",
    });
  }

  try {
    const {
      initialComplaint,
      messages,
      language,
    } = validation.data;

    // Generate the next question in the selected language
    const result = await generateNextQuestion({
      initialComplaint,
      messages,
      language,
    });

    if (result.status === "continue") {
      return res.json({
        success: true,
        data: {
          status: "continue",
          nextQuestion: result.question,
          inputType: result.inputType,
          options: result.options || [],
        },
      });
    }

    if (result.status === "completed") {
      return res.json({
        success: true,
        data: {
          status: "completed",
          summary: result.summary,
        },
      });
    }

    return res.status(502).json({
      success: false,
      message: "Unexpected AI response.",
    });
  } catch (error) {
    console.error("Health interview AI request failed:", error);

    return res.status(502).json({
      success: false,
      message: "Unable to process the interview. Please try again.",
    });
  }
});

export default router;
