
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function getNextQuestion(
  initialComplaint,
  messages,
  language = "en"
) {
  const response = await fetch(
    `${API_URL}/api/health-interview/next`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initialComplaint,
        messages,
        language,
      }),
    }
  );

  const responseBody = await response.json();

  console.log("FRONTEND API RESPONSE:", responseBody);

  if (!response.ok) {
    throw new Error(
      responseBody.message || "Unable to process the interview."
    );
  }

  const result = responseBody.data ?? responseBody;

  if (!result || typeof result !== "object") {
    throw new Error("Invalid AI response received.");
  }

  return result;
}
