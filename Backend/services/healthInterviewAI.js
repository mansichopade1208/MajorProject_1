
import { openai } from "../config/openai.js";

const languageNames = {
  en: "English",
  hi: "Hindi",
  gu: "Gujarati",
  mr: "Marathi",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
};

export async function generateNextQuestion({
  initialComplaint,
  messages,
  language = "en",
}) {
  const selectedLanguage = languageNames[language] || "English";

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

LANGUAGE INSTRUCTION:
- Communicate entirely in ${selectedLanguage}.
- Generate every question in ${selectedLanguage}.
- Generate all answer options in ${selectedLanguage}.
- Generate the final patient history summary in ${selectedLanguage}.
- Do not switch to English unless the selected language is English.
- Keep the language simple and easy for patients to understand.
- Keep the JSON keys and status/inputType values in English.
- Translate option labels such as Yes, No, Other, None of these and Not sure into ${selectedLanguage}.

GOAL:
Collect relevant information for a doctor to review.
Do not conduct an endless interview.

QUESTION RULES:
1. Ask only ONE concise question per response.
2. Ask a maximum of 4 follow-up questions normally.
3. Ask a 5th question only when essential.
4. Finish earlier when sufficient information is available.
5. Never repeat questions.
6. Consider symptoms, onset, duration, severity, location,
   associated symptoms and impact.
7. Accept unknown answers.
8. Never diagnose or prescribe medication.
9. For potentially life-threatening symptoms, advise immediate
   emergency medical assessment in ${selectedLanguage}.
10. Never invent patient information.

DYNAMIC INPUT GENERATION:

For every follow-up question, return:

{
  "status": "continue",
  "question": "Your question in ${selectedLanguage}",
  "inputType": "single_select",
  "options": ["Option 1", "Option 2", "Other"]
}

SUPPORTED INPUT TYPES:

1. single_select:
   - Use when only one answer is expected.
   - Generate 2-8 relevant options.

2. multi_select:
   - Use when multiple answers can apply.
   - Generate relevant symptom options.
   - Include the translated equivalent of "None of these" when appropriate.
   - Include the translated equivalent of "Other" when appropriate.

3. yes_no:
   - Use for simple yes/no questions.
   - Options should be the translated equivalents of
     ["Yes", "No", "Not sure"].

4. free_text:
   - Use when a descriptive answer is necessary.
   - Options must be [].

DYNAMIC OPTION RULES:
- Generate options based on the exact question.
- Consider the initial complaint and all previous answers.
- Never use a fixed symptom list.
- Never generate unrelated options.
- Options must be short and easy to understand.
- Include the translated equivalent of "Other" when the patient may have an unlisted answer.
- Include the translated equivalent of "Not sure" when useful.
- Do not include "Other" or "None of these" unnecessarily.
- For multi_select, allow multiple relevant answers.
- For pain severity, consider a suitable scale or descriptive choices.
- If the question needs detailed explanation, use free_text.

COMPLETION:
When enough information is available, return:

{
  "status": "completed",
  "summary": "A readable patient history summary in ${selectedLanguage}."
}

SUMMARY RULES:
- Plain text string.
- Write the summary in ${selectedLanguage}.
- Include only information explicitly provided.
- Include reported symptoms and explicitly denied symptoms.
- Mention relevant missing information.
- Never infer negative symptoms from silence.
- No diagnosis or prescription.

FOLLOW-UP LIMIT:
Current follow-up count: ${followUpCount}.
Standard limit: 4.
Maximum limit: 5.

At 4 questions, complete unless an important clarification
is genuinely necessary. Never exceed 5.

Always return valid JSON.
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

    max_tokens: 800,
    temperature: 0.3,
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

  if (result.status === "continue") {
    const allowedTypes = [
      "single_select",
      "multi_select",
      "yes_no",
      "free_text",
    ];

    if (
      typeof result.question !== "string" ||
      !result.question.trim()
    ) {
      throw new Error("AI returned an invalid question.");
    }

    const inputType = allowedTypes.includes(result.inputType)
      ? result.inputType
      : "free_text";

    const options =
      inputType === "free_text"
        ? []
        : Array.isArray(result.options)
          ? result.options
              .filter(
                (option) =>
                  typeof option === "string" && option.trim()
              )
              .slice(0, 8)
          : [];

    if (
      inputType !== "free_text" &&
      options.length === 0
    ) {
      throw new Error("AI returned no valid options.");
    }

    return {
      status: "continue",
      question: result.question.trim(),
      inputType,
      options,
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
