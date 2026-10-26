
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function getNextQuestion(initialComplaint, messages) {
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
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to process the interview."
    );
  }

  if (!result.success || !result.data?.status) {
    throw new Error("Invalid response received from the server.");
  }

  return result.data;
}
