
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

import ConversationalInterview from "../../components/patient/Newconsultation/ConversationalInterview.jsx";
import MedicalHistory from "../../components/patient/Newconsultation/MedicalHistory.jsx";
import MedicalDocumentUpload from "../../components/patient/Newconsultation/MedicalDocumentUpload.jsx";
import ConsultationReview from "../../components/patient/Newconsultation/ConsultationReview.jsx";
import { submitConsultation } from "../../../services/consultationService.js";

export default function NewConsultation() {
  const [step, setStep] = useState(0);
  const [interviewSummary, setInterviewSummary] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [medicalDocuments, setMedicalDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [finalReport, setFinalReport] = useState("");

  useEffect(() => {
    if (interviewSummary.trim()) {
      setStep(1);
    }
  }, [interviewSummary]);

  async function handleSubmit() {
    if (submitting) return;

    if (!interviewSummary.trim()) {
      setSubmitError("Please complete the patient interview first.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await submitConsultation({
        interviewSummary,
        medicalHistory,
        medicalDocuments,
      });

      console.log("Report API response:", result);

      if (!result?.finalReport) {
        throw new Error("The server did not return a consultation report.");
      }

      setFinalReport(result.finalReport);
    } catch (error) {
      console.error("Consultation submission failed:", error);

      setSubmitError(
        error.message || "Unable to generate the report. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    {
      title: "Tell us what brings you here",
      description:
        "Describe your current symptoms in your own words. The interview interface will display follow-up questions provided by the AI service.",
    },
    {
      title: "Your medical history",
      description:
        "Add information about past illnesses, ongoing conditions, allergies and medications.",
    },
    {
      title: "Upload medical documents",
      description:
        "Select relevant prescriptions, laboratory reports or discharge summaries.",
    },
    {
      title: "Review and submit",
      description:
        "Review your answers and selected documents before submitting your information.",
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="mx-auto w-full max-w-3xl">
      {finalReport ? (
        // Show only the generated report after successful submission
        <section className="rounded-2xl border border-[#DCE5DC] bg-white p-6 sm:p-9">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
            <MessageCircle size={25} />
          </div>

          <h1 className="text-2xl font-bold text-[#214D43]">
            Final Consultation Report
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Your consultation report has been generated successfully.
          </p>

          <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {finalReport}
            </p>
          </div>

          <Link
            to="/patient/dashboard"
            className="mt-6 inline-flex items-center rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50]"
          >
            Back to Dashboard
          </Link>
        </section>
      ) : (
        // Show the consultation steps until a report is generated
        <>
          <Link
            to="/patient/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#47796E] hover:underline"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="rounded-2xl border border-[#E7E7DF] bg-white p-6 sm:p-9">
            <p className="text-sm font-medium text-[#47796E]">
              Step {step + 1} of {steps.length}
            </p>

            <div className="mt-3 flex gap-2">
              {steps.map((item, index) => (
                <div
                  key={item.title}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= step ? "bg-[#47796E]" : "bg-[#E5EAE4]"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
              <MessageCircle size={25} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#214D43]">
              {currentStep.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              {currentStep.description}
            </p>

            {step === 0 && (
              <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
                <ConversationalInterview onComplete={setInterviewSummary} />
              </div>
            )}

            {step === 1 && (
              <MedicalHistory onComplete={setMedicalHistory} />
            )}

            {step === 2 && (
              <MedicalDocumentUpload
                files={medicalDocuments}
                onFilesChange={setMedicalDocuments}
              />
            )}

            {step === 3 && (
              <ConsultationReview
                interviewSummary={interviewSummary}
                medicalHistory={medicalHistory}
                medicalDocuments={medicalDocuments}
              />
            )}

            {submitError && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {submitError}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={step === 0 || submitting}
                onClick={() => setStep((current) => current - 1)}
                className="rounded-xl border border-[#DCE5DC] px-4 py-3 text-sm font-medium text-[#315F53] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((current) => current + 1)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50]"
                >
                  Continue <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50] disabled:opacity-50"
                >
                  {submitting ? "Generating report..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
