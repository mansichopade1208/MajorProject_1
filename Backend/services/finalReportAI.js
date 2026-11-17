
import { openai } from "../config/openai.js";

export async function generateFinalReport({
  interviewSummary = "",
  medicalHistory = "",
  documents = [],
}) {
  const documentContext = documents.length
    ? documents
        .map(
          (document, index) => `
DOCUMENT ${index + 1}
File: ${document.fileName || "Unknown file"}

Extracted text:
${document.text || "No readable text could be extracted."}
`
        )
        .join("\n\n")
    : "No medical documents provided.";

  const response = await openai.chat.completions.create({
    model: process.env.OPENROUTER_MODEL || "openai/gpt-4.1-mini",

    response_format: {
      type: "json_object",
    },

    messages: [
      {
        role: "system",
        content: `
You are a clinical documentation assistant.
Prepare a SHORT, structured patient summary for a doctor.

MAIN OBJECTIVE:
A doctor should be able to scan the report in 5-10 seconds.

STRICT RULES:
1. Use only information explicitly provided.
2. Never invent symptoms, values, dates, medications or diagnoses.
3. Keep every item short, preferably under 12 words.
4. Avoid long paragraphs and repeated information.
5. Do not add generic medical advice or guidelines.
6. Clearly distinguish patient-reported information from document findings.
7. Never treat fictional, sample or unrelated documents as actual patient results.
8. Preserve units and numerical values exactly.
9. Do not infer negative symptoms from missing information.
10. Mention missing information briefly.
11. Do not diagnose or prescribe treatment.
12. Use empty arrays or "Not provided" when information is unavailable.

RETURN ONLY VALID JSON in this exact structure:

{
  "title": "Patient Clinical Summary",

  "chiefComplaint": {
    "problem": "Main complaint",
    "duration": "Duration or Not provided",
    "severity": "Severity or Not provided"
  },

  "symptoms": [
    "Reported symptom 1",
    "Reported symptom 2"
  ],

  "keyValues": [
    {
      "label": "Temperature",
      "value": "38-39°C",
      "source": "Patient reported"
    }
  ],

  "medicalHistory": [
    "Relevant past medical history"
  ],

  "allergies": [
    "Known allergy"
  ],

  "medications": [
    "Current medication"
  ],

  "documentFindings": [
    {
      "name": "Document name",
      "finding": "Short relevant finding",
      "status": "Relevant"
    }
  ],

  "missingInformation": [
    "Important missing information"
  ],

  "doctorSummary": "Maximum 2 short sentences summarizing the case."
}

FIELD RULES:

- chiefComplaint: Include the primary problem and duration.
- symptoms: Only explicitly reported symptoms.
- keyValues: Include important numerical values with units.
- medicalHistory: Include only relevant history.
- allergies: List known allergies; otherwise use ["Not provided"].
- medications: List current medications; otherwise use ["Not provided"].
- documentFindings: Include only relevant extracted findings.
- missingInformation: Only important missing details.
- Extract relevant laboratory test names, values, units,
   reference ranges and dates from uploaded documents (if necessary for patient problem).

For completed interview summaries, preserve the distinction
between reported and explicitly denied symptoms.

Return JSON only. No Markdown fences or extra text.
`,
      },
      {
        role: "user",
        content: `
PATIENT INTERVIEW:
${interviewSummary}

PATIENT MEDICAL HISTORY:
${medicalHistory}

UPLOADED DOCUMENTS:
${documentContext}

Prepare the concise clinical summary.
`,
      },
    ],

    max_tokens: 1200,
    temperature: 0.2,
  });

  const output =
    response.choices[0]?.message?.content?.trim();

  console.log("FINAL REPORT RAW RESPONSE:", output);

  if (!output) {
    throw new Error("AI returned an empty final report.");
  }

  let report;

  try {
    report = JSON.parse(output);
  } catch {
    throw new Error("AI returned an invalid report format.");
  }

  if (
    !report.chiefComplaint ||
    !Array.isArray(report.symptoms) ||
    !Array.isArray(report.keyValues) ||
    !Array.isArray(report.allergies) ||
    !Array.isArray(report.medications) ||
    !Array.isArray(report.documentFindings) ||
    !Array.isArray(report.missingInformation)
  ) {
    throw new Error("AI returned an incomplete report.");
  }

  return report;
}
