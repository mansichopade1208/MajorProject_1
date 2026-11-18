
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  ClipboardList,
  AlertCircle,
  Activity,
  HeartPulse,
  Pill,
  ShieldAlert,
  Stethoscope,
  KeyRound,
  Copy,
  Check,
  FileCheck,
  Info,
} from "lucide-react";

import { getMyConsultations } from "../../../services/consultationService.js";

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
        <Icon size={18} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#214D43]">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function TagList({ items, emptyText = "Not provided" }) {
  const validItems = Array.isArray(items)
    ? items.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  if (!validItems.length) {
    return <p className="text-sm italic text-gray-400">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {validItems.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-lg border border-[#DCE7DF] bg-[#F5F8F5] px-3 py-2 text-sm text-[#405B50]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ClinicalReport({ report }) {
  if (typeof report === "string") {
    return (
      <div className="whitespace-pre-wrap rounded-xl bg-white p-5 text-sm leading-7 text-gray-700">
        {report}
      </div>
    );
  }

  const data = report || {};
  const complaint = data.chiefComplaint || {};
  const keyValues = Array.isArray(data.keyValues) ? data.keyValues : [];
  const documents = Array.isArray(data.documentFindings)
    ? data.documentFindings
    : [];
  const missing = Array.isArray(data.missingInformation)
    ? data.missingInformation
    : [];

  return (
    <div className="space-y-4">
      {/* Chief complaint */}
      <section className="rounded-xl border border-[#DCE7DF] bg-white p-5">
        <SectionHeading
          icon={Activity}
          title="Chief Complaint"
          subtitle="Primary reason for consultation"
        />

        <h3 className="text-lg font-semibold text-[#214D43]">
          {complaint.problem || "Not provided"}
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-[#F5F8F5] p-3">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {complaint.duration || "Not provided"}
            </p>
          </div>

          <div className="rounded-lg bg-[#F5F8F5] p-3">
            <p className="text-xs text-gray-500">Severity</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {complaint.severity || "Not provided"}
            </p>
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={HeartPulse}
          title="Reported Symptoms"
          subtitle="Symptoms reported by the patient"
        />
        <TagList items={data.symptoms} />
      </section>

      {/* Key clinical values */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={Activity}
          title="Important Clinical Values"
          subtitle="Values identified during the consultation"
        />

        {keyValues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-3 py-3 font-semibold">Parameter</th>
                  <th className="px-3 py-3 font-semibold">Value</th>
                  <th className="px-3 py-3 font-semibold">Source</th>
                </tr>
              </thead>

              <tbody>
                {keyValues.map((item, index) => (
                  <tr key={index} className="border-b border-gray-50 last:border-0">
                    <td className="px-3 py-3 font-medium text-gray-700">
                      {item?.label || "—"}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#326F61]">
                      {item?.value || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">
                      {item?.source || "Not specified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">
            No additional clinical values provided.
          </p>
        )}
      </section>

      {/* Medical history */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={ClipboardList}
          title="Medical History"
          subtitle="Relevant past medical information"
        />
        <TagList items={data.medicalHistory} />
      </section>

      {/* Allergies and medications */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
          <SectionHeading icon={ShieldAlert} title="Allergies" />
          <TagList items={data.allergies} />
        </section>

        <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
          <SectionHeading icon={Pill} title="Current Medications" />
          <TagList items={data.medications} />
        </section>
      </div>

      {/* Document findings */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={FileCheck}
          title="Uploaded Document Findings"
          subtitle="Information extracted from uploaded documents"
        />

        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((document, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#E7ECE7] bg-[#F8FAF8] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#214D43]">
                    {document?.name || `Document ${index + 1}`}
                  </p>

                  <span className="rounded-full bg-[#E0EEE7] px-3 py-1 text-xs font-medium text-[#47796E]">
                    {document?.status || "Reviewed"}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {document?.finding || "No findings available."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">
            No documents were uploaded.
          </p>
        )}
      </section>

      {/* Missing information */}
      <section className="rounded-xl border border-[#EADFBF] bg-[#FFFCF4] p-5">
        <SectionHeading
          icon={Info}
          title="Missing Information / Needs Review"
          subtitle="Important details not available in the submitted information"
        />

        <TagList
          items={missing}
          emptyText="No additional missing information identified."
        />
      </section>

      {/* Doctor summary */}
      <section className="rounded-xl border border-[#CFE0DA] bg-[#F0F7F2] p-5">
        <SectionHeading
          icon={Stethoscope}
          title="Summary for Doctor Review"
          subtitle="AI-generated overview of the submitted information"
        />

        <p className="text-sm leading-7 text-[#405B50]">
          {data.doctorSummary || "Summary not available."}
        </p>
      </section>

      <p className="px-1 text-xs leading-5 text-gray-400">
        This AI-generated report is intended to support clinical review.
        It is not a medical diagnosis or prescription.
      </p>
    </div>
  );
}

export default function MyConsultations() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  async function fetchConsultations() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyConsultations();
      setConsultations(data);
    } catch (err) {
      console.error("Consultations loading error:", err);
      setError(err.message || "Unable to load consultations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConsultations();
  }, []);

  async function copyToken(token, id) {
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);
      setCopiedId(id);

      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      setError("Could not copy the token. Please copy it manually.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/patient/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#47796E] hover:underline"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
            <ClipboardList size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#214D43]">
              My Consultations
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View your consultation reports and access tokens.
            </p>
          </div>
        </div>

        <Link
          to="/patient/consultation/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50]"
        >
          <Plus size={18} />
          New Consultation
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border border-[#E7E7DF] bg-white px-6 py-16 text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-[#47796E]"
          />
          <p className="mt-4 text-sm font-medium text-[#315F53]">
            Loading your consultations...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
          <AlertCircle size={35} className="mx-auto text-red-500" />
          <h3 className="mt-4 font-semibold text-[#214D43]">
            Unable to load consultations
          </h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchConsultations}
            className="mt-5 rounded-lg bg-[#326F61] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && consultations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#CADBD0] bg-white px-6 py-16 text-center">
          <FileText size={35} className="mx-auto text-[#47796E]" />
          <h3 className="mt-5 text-lg font-bold text-[#214D43]">
            No consultations yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Your completed consultation reports will appear here.
          </p>
          <Link
            to="/patient/consultation/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Start Consultation
          </Link>
        </div>
      )}

      {!loading && !error && consultations.length > 0 && (
        <>
          <div className="mb-5 rounded-xl border border-[#DCE7DF] bg-[#F4F8F6] p-4">
            <p className="text-sm text-gray-500">Total consultations</p>
            <p className="mt-1 text-2xl font-bold text-[#214D43]">
              {consultations.length}
            </p>
          </div>

          <div className="space-y-5">
            {consultations.map((consultation, index) => {
              const report = consultation.finalReport || {};
              const isExpanded = expandedId === consultation._id;
              const copied = copiedId === consultation._id;

              return (
                <article
                  key={consultation._id}
                  className="overflow-hidden rounded-2xl border border-[#E2E8E2] bg-white shadow-sm"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
                          <FileText size={22} />
                        </div>

                        <div>
                          <h2 className="font-bold text-[#214D43]">
                            {report.title || "Patient Clinical Summary"}
                          </h2>

                          <p className="mt-1 text-sm text-gray-600">
                            {report.chiefComplaint?.problem ||
                              "Consultation report generated"}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <CalendarDays size={14} />
                            {formatDate(consultation.createdAt)}
                            <span>•</span>
                            Consultation #{consultations.length - index}
                          </div>
                        </div>
                      </div>

                      <span className="rounded-full border border-[#CDE7D7] bg-[#F0FAF3] px-3 py-1.5 text-xs font-semibold text-[#28734A]">
                        Report Generated
                      </span>
                    </div>

                    {report.doctorSummary && (
                      <div className="mt-4 rounded-xl bg-[#F4F8F6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#47796E]">
                          AI Summary
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {report.doctorSummary}
                        </p>
                      </div>
                    )}

                    {/* Access token shown with this report */}
                    <div className="mt-4 rounded-xl border border-[#CFE0DA] bg-[#F4F8F6] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <KeyRound size={19} className="text-[#47796E]" />
                          <div>
                            <h3 className="text-sm font-semibold text-[#214D43]">
                              Report Access Token
                            </h3>
                            <p className="text-xs text-gray-500">
                              Share this token with your doctor.
                            </p>
                          </div>
                        </div>

                        {consultation.accessToken && (
                          <button
                            type="button"
                            onClick={() =>
                              copyToken(
                                consultation.accessToken,
                                consultation._id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#326F61] px-4 py-2 text-xs font-semibold text-white hover:bg-[#285C50]"
                          >
                            {copied ? <Check size={15} /> : <Copy size={15} />}
                            {copied ? "Copied" : "Copy Token"}
                          </button>
                        )}
                      </div>

                      {consultation.accessToken ? (
                        <p className="mt-3 break-all rounded-lg border border-[#DCE5DC] bg-white px-4 py-3 font-mono text-base font-bold tracking-widest text-[#214D43]">
                          {consultation.accessToken}
                        </p>
                      ) : (
                        <p className="mt-3 text-xs text-gray-500">
                          Token unavailable for this older consultation.
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF0EA] pt-4">
                      <p className="text-xs text-gray-400">
                        Created on {formatDate(consultation.createdAt)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            isExpanded ? null : consultation._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#E0EEE7] px-4 py-2.5 text-sm font-semibold text-[#315F53] hover:bg-[#D3E6DA]"
                      >
                        {isExpanded ? "Hide Full Report" : "View Full Report"}
                        {isExpanded ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#E2E8E2] bg-[#F8FAF6] p-5 sm:p-6">
                      <h3 className="mb-4 text-lg font-bold text-[#214D43]">
                        {report.title || "Patient Clinical Summary"}
                      </h3>
                      <ClinicalReport report={report} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
