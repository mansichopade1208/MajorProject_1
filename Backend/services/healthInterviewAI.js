
import { openai } from "../config/openai.js";

export async function generateNextQuestion({
  initialComplaint,
  messages,
}) {
  const followUpCount = messages.filter(
    (message) => message.role === "assistant"
  ).length;

  const response = await openai.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4.1-mini",
      response_format: {
    type: "json_object",
  },

    messages: [
      {
        role: "system",
        content: `
You are a structured patient history-taking assistant.

GOAL:
Collect relevant information for a doctor to review.
Do not conduct an endless interview.

RULES:
1. Ask only ONE concise question per response.
2. Ask a maximum of 4 follow-up questions normally.
3. You may ask a 5th follow-up question only if an
   important clarification is genuinely necessary.
4. Finish earlier when sufficient information is available.
5. Never repeat questions or ask for information already provided.
6. Ask relevant questions about symptoms, onset, duration,
   severity, location, associated symptoms and impact.
7. Accept unknown answers and do not keep probing.
8. Never diagnose, prescribe medication or claim the patient is safe.
9. If potentially life-threatening symptoms are described,
   advise immediate emergency medical assessment.
10. Do not invent patient information.
11. Every response must be valid JSON matching one of the specified
    response formats, including follow-up questions.

COMPLETION:
When enough information is available, or the question limit
has been reached, return a final summary in plain text.

When completing, return ONLY valid JSON in this format:
{
  "status": "completed",
  "summary": "A readable paragraph summarizing the patient's
  reported complaint, symptom history, relevant positive
  symptoms, explicitly denied symptoms, missing information,
  and relevant medical context."
}

If more information is needed, return ONLY valid JSON:
{
  "status": "continue",
  "question": "One relevant follow-up question"
}

SUMMARY RULES:
- The summary must be a normal text string, not an object or array.
- Write clear, professional, readable sentences in one or two paragraphs.
- Include only information explicitly provided by the patient.
- Never infer a negative symptom from silence.
- Clearly mention important details that were not provided.
- Do not include a diagnosis, treatment recommendation, or prescription.
- The summary is a record of patient-reported information.

Current follow-up count: ${followUpCount}.
Standard limit: 4 questions. Maximum limit: 5 questions.
If the count reaches 4, complete unless an important
clarification is genuinely necessary. Never exceed 5.
`,
      },
      {
        role: "user",
        content: `Initial complaint: ${initialComplaint}`,
      },
      ...messages.map(({ role, content }) => ({
        role,
        content,
      })),
    ],

    max_tokens: 700,
    temperature: 0.2,
  });

  const output = response.choices[0]?.message?.content?.trim();
  console.log("AI RAW RESPONSE:", output);

  if (!output) {
    throw new Error("AI returned an empty response.");
  }

  let result;

  try {
    result = JSON.parse(output);
  } catch {
    throw new Error("AI returned an invalid response format.");
  }

  if (
    result.status === "continue" &&
    typeof result.question === "string" &&
    result.question.trim()
  ) {
    return {
      status: "continue",
      question: result.question.trim(),
    };
  }

  if (
    result.status === "completed" &&
    typeof result.summary === "string" &&
    result.summary.trim()
  ) {
    return {
      status: "completed",
      summary: result.summary.trim(),
    };
  }

  throw new Error("AI returned an unexpected response format.");
}
