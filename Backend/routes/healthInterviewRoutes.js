
import { Router } from "express";
import { z } from "zod";
import { generateNextQuestion } from "../services/healthInterviewAI.js";

const router = Router();

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
  })
  .strict();

router.post("/next", async (req, res) => {
  const validation = interviewSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: "Please provide valid interview messages.",
    });
  }

  try {
    const result = await generateNextQuestion(validation.data);

    if (result.status === "continue") {
      return res.json({
        success: true,
        data: {
          status: "continue",
          nextQuestion: result.question,
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
  } 
catch (error) {
  console.error("Health interview AI request failed:", error);

  return res.status(502).json({
    success: false,
    message: "Unable to process the interview. Please try again.",
  });


  }
});

export default router;
