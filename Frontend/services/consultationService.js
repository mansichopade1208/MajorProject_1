
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function submitConsultation({
  interviewSummary,
  medicalHistory,
  medicalDocuments,
}) {
  const formData = new FormData();

  formData.append("interviewSummary", interviewSummary);
  formData.append("medicalHistory", medicalHistory);

  medicalDocuments.forEach((file) => {
    formData.append("medicalDocuments", file);
  });

  const response = await fetch(
    `${API_URL}/api/consultations/submit`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("medikioskToken")}`,
      },
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to submit the consultation."
    );
  }

  return result.data;
}
