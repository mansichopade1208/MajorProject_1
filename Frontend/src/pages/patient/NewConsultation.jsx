import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Activity,
  HeartPulse,
  ClipboardList,
  AlertCircle,
  FileText,
  Pill,
  ShieldAlert,
  CheckCircle2,
  Stethoscope,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import ConversationalInterview from "../../components/patient/Newconsultation/ConversationalInterview.jsx";
import MedicalHistory from "../../components/patient/Newconsultation/MedicalHistory.jsx";
import MedicalDocumentUpload from "../../components/patient/Newconsultation/MedicalDocumentUpload.jsx";
import ConsultationReview from "../../components/patient/Newconsultation/ConsultationReview.jsx";
import { submitConsultation } from "../../../services/consultationService.js";

const SECTION_STYLE = "rounded-xl border border-[#E2E8ED] bg-white p-5";

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3F7] text-[#315B78]">
        <Icon size={18} />
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-wide text-[#243B53]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-0.5 text-xs text-[#718096]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function EmptyValue({ value }) {
  if (!value || value === "Not provided" || value === "Not available") {
    return <span className="text-sm italic text-[#8995A3]">Not provided</span>;
  }

  return <span className="text-sm text-[#334155]">{value}</span>;
}

function TagList({ items, emptyText = "Not provided" }) {
  const validItems = Array.isArray(items)
    ? items.filter((item) => item && typeof item === "string" && item.trim())
    : [];

  if (!validItems.length) {
    return <p className="text-sm italic text-[#8995A3]">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {validItems.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm text-[#334155]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ClinicalReport({ report }) {
  // Support older string-based reports.
  if (typeof report === "string") {
    return (
      <div className="whitespace-pre-wrap rounded-xl border border-[#E2E8ED] bg-white p-5 text-sm leading-7 text-[#334155]">
        {report}
      </div>
    );
  }

  const data = report || {};
  const complaint = data.chiefComplaint || {};

  const documents = Array.isArray(data.documentFindings)
    ? data.documentFindings
    : [];

  const keyValues = Array.isArray(data.keyValues) ? data.keyValues : [];

  const missing = Array.isArray(data.missingInformation)
    ? data.missingInformation
    : [];

  return (
    <div className="space-y-4">
      {/* Chief complaint */}
      <section className="rounded-xl border border-[#D8E3EC] bg-[#F5F8FB] p-5">
        <SectionHeading
          icon={Activity}
          title="Chief Complaint"
          subtitle="Primary reason for consultation"
        />

        <h2 className="text-xl font-semibold text-[#203B53]">
          {complaint.problem || "Not provided"}
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E1E8EF] bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#718096]">
              Duration
            </p>
            <p className="mt-1 text-sm font-semibold text-[#334155]">
              <EmptyValue value={complaint.duration} />
            </p>
          </div>

          <div className="rounded-lg border border-[#E1E8EF] bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#718096]">
              Severity
            </p>
            <p className="mt-1 text-sm font-semibold text-[#334155]">
              <EmptyValue value={complaint.severity} />
            </p>
          </div>
        </div>
      </section>

      {/* Reported symptoms */}
      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={HeartPulse}
          title="Reported Symptoms"
          subtitle="Symptoms reported by the patient"
        />

        <TagList items={data.symptoms} />
      </section>

      {/* Important clinical values */}
      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={Activity}
          title="Important Clinical Values"
          subtitle="Values recorded during the consultation"
        />

        {keyValues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8EDF1] text-xs uppercase tracking-wide text-[#718096]">
                  <th className="px-3 py-3 font-semibold">Parameter</th>
                  <th className="px-3 py-3 font-semibold">Value</th>
                  <th className="px-3 py-3 font-semibold">Source</th>
                </tr>
              </thead>

              <tbody>
                {keyValues.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#F0F2F5] last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-[#334155]">
                      {item.name || item.parameter || "—"}
                    </td>

                    <td className="px-3 py-3 font-semibold text-[#176B61]">
                      {item.value || "—"}
                      {item.unit ? ` ${item.unit}` : ""}
                    </td>

                    <td className="px-3 py-3 text-xs text-[#718096]">
                      {item.source || "Not specified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm italic text-[#8995A3]">
            No additional clinical values provided.
          </p>
        )}
      </section>

      {/* Medical history */}
      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={ClipboardList}
          title="Medical History"
          subtitle="Relevant pre-existing medical information"
        />

        <TagList items={data.medicalHistory} />
      </section>

      {/* Allergies and medications */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className={SECTION_STYLE}>
          <SectionHeading icon={ShieldAlert} title="Allergies" />

          <TagList items={data.allergies} />
        </section>

        <section className={SECTION_STYLE}>
          <SectionHeading icon={Pill} title="Current Medications" />

          <TagList items={data.medications} />
        </section>
      </div>

      {/* Uploaded documents */}
      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={FileText}
          title="Uploaded Document Findings"
          subtitle="Information extracted from patient-provided documents"
        />

        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((document, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#E4E9EE] bg-[#FAFBFC] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#334155]">
                    {document.name || `Document ${index + 1}`}
                  </p>

                  <span className="rounded-md bg-[#F3F0E5] px-2.5 py-1 text-xs font-medium text-[#8A6A26]">
                    {document.status || "Reviewed"}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  {document.finding || "No findings available."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-[#8995A3]">
            No documents were uploaded.
          </p>
        )}
      </section>

      {/* Missing information */}
      <section className="rounded-xl border border-[#EADFBF] bg-[#FFFCF4] p-5">
        <SectionHeading
          icon={AlertCircle}
          title="Missing Information / Needs Review"
          subtitle="Details not available in the submitted information"
        />

        {missing.length > 0 ? (
          <ul className="space-y-2">
            {missing.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-[#725B2B]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B58A36]" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#725B2B]">
            No additional missing information was identified.
          </p>
        )}
      </section>

      {/* Doctor summary */}
      <section className="rounded-xl border border-[#CFE0DA] bg-[#F4F8F6] p-5">
        <SectionHeading
          icon={Stethoscope}
          title="Summary for Doctor Review"
          subtitle="Concise overview of the submitted patient information"
        />

        <p className="text-sm leading-7 text-[#334E4A]">
          {data.doctorSummary || "Summary not available."}
        </p>
      </section>

      <p className="px-1 text-xs leading-5 text-[#8995A3]">
        This report contains patient-provided information and extracted document
        details. It is intended for review by a qualified healthcare
        professional.
      </p>
    </div>
  );
}

export default function NewConsultation() {
  const [step, setStep] = useState(0);
  const [interviewSummary, setInterviewSummary] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [medicalDocuments, setMedicalDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [finalReport, setFinalReport] = useState(null);
  const [accessToken, setAccessToken] = useState("");

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

      const report = result?.finalReport ?? result?.data?.finalReport;

      if (
        !report ||
        (typeof report !== "string" && typeof report !== "object")
      ) {
        throw new Error(
          "The server did not return a valid consultation report.",
        );
      }

      setFinalReport(report);
      setAccessToken(result.accessToken);
    } catch (error) {
      console.error("Consultation submission failed:", error);

      setSubmitError(
        error.message || "Unable to generate the report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const steps = [
    {
      title: "Tell us what brings you here",
      description:
        "Describe your current symptoms. The AI assistant will ask relevant follow-up questions.",
    },
    {
      title: "Your medical history",
      description:
        "Provide information about past illnesses, existing conditions, allergies and medications.",
    },
    {
      title: "Upload medical documents",
      description:
        "Upload relevant prescriptions, laboratory reports or discharge summaries.",
    },
    {
      title: "Review and submit",
      description:
        "Review your information before generating the consultation report.",
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="mx-auto w-full max-w-4xl">
      {finalReport ? (
        <section className="rounded-2xl border border-[#DCE4E9] bg-[#F8FAFB] p-5 sm:p-8">
          {/* Report header */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#E1E7EC] pb-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E8F0F2] text-[#315B78]">
                <MessageCircle size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-[#203B53] sm:text-2xl">
                  {typeof finalReport === "object"
                    ? finalReport.title || "Patient Clinical Summary"
                    : "Patient Clinical Summary"}
                </h1>

                <p className="mt-1 text-xs text-[#718096]">
                  Consultation report generated successfully
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE7D7] bg-[#F0FAF3] px-3 py-1.5 text-xs font-semibold text-[#28734A]">
              <CheckCircle2 size={14} />
              Ready for review
            </span>
          </div>

          <ClinicalReport report={finalReport} />

          {/* Patient Report Access Token */}
          <div className="mt-6 rounded-xl border border-[#CFE0DA] bg-[#F4F8F6] p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
                <KeyRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#214D43]">
                  Your Report Access Token
                </h2>

                <p className="text-xs text-[#718096]">
                  Share this token with your doctor.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex-1 rounded-lg border border-[#DCE5DC] bg-white px-4 py-3">
                <p className="text-lg font-bold tracking-widest text-[#315B78]">
                  {accessToken}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(accessToken);
                }}
                className="rounded-lg bg-[#47796E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315E54]"
              >
                Copy Token
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#718096]">
              Keep this token private and share it only with your authorized
              healthcare professional. Anyone who has the token may be able to
              request access to your report.
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E7EC] pt-5">
            <p className="text-xs text-[#718096]">
              Please verify the information before clinical use.
            </p>

            <Link
              to="/patient/dashboard"
              className="inline-flex items-center rounded-lg bg-[#315B78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264A63]"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>
      ) : (
        <>
          <Link
            to="/patient/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#47796E] hover:underline"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="rounded-2xl border border-[#E2E8ED] bg-white p-5 sm:p-8">
            <p className="text-sm font-semibold text-[#315B78]">
              Step {step + 1} of {steps.length}
            </p>

            <div className="mt-3 flex gap-2">
              {steps.map((item, index) => (
                <div
                  key={item.title}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= step ? "bg-[#315B78]" : "bg-[#E5EAEF]"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F0F2] text-[#315B78]">
              <MessageCircle size={24} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#203B53]">
              {currentStep.title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#718096]">
              {currentStep.description}
            </p>

            {step === 0 && (
              <div className="mt-6 rounded-xl border border-[#E2E8ED] bg-[#FAFBFC] p-4 sm:p-5">
                <ConversationalInterview onComplete={setInterviewSummary} />
              </div>
            )}

            {step === 1 && <MedicalHistory onComplete={setMedicalHistory} />}

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
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {submitError}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#EDF0F3] pt-5">
              <button
                type="button"
                disabled={step === 0 || submitting}
                onClick={() => setStep((current) => current - 1)}
                className="rounded-lg border border-[#DCE4E9] px-4 py-2.5 text-sm font-medium text-[#40566B] transition hover:bg-[#F5F7F9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((current) => current + 1)}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#315B78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264A63]"
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-lg bg-[#315B78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264A63] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Generating report..."
                    : "Generate Consultation Report"}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
