import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Stethoscope,
  UserRound,
} from "lucide-react";

import PatientDocuments from "../../components/doctor/PatientDocuments.jsx";
import DicomViewer from "../../components/doctor/DicomViewer.jsx";

const API_URL = "http://localhost:5000/api";

const cardClass = "rounded-2xl border border-[#E6EAE2] bg-white p-5 shadow-sm";

function formatDate(date) {
  if (!date) return "Not provided";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getAge(dateOfBirth) {
  if (!dateOfBirth) return "Not provided";

  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return "Not provided";

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return `${age} years`;
}

function ValueList({ items, emptyText = "Not provided" }) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-sm text-[#8A9B93]">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => {
        const text =
          typeof item === "string"
            ? item
            : item?.label
              ? `${item.label}: ${item.value || "Not provided"}`
              : JSON.stringify(item);

        return (
          <li
            key={index}
            className="flex items-start gap-2 text-sm leading-6 text-[#45645A]"
          >
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#47796F]" />
            <span>{text}</span>
          </li>
        );
      })}
    </ul>
  );
}

function ReportSection({ title, icon: Icon, children }) {
  return (
    <section className={cardClass}>
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-[#EDF4EF] p-2.5 text-[#47796F]">
          <Icon size={19} />
        </div>

        <h3 className="text-base font-bold text-[#214A43]">{title}</h3>
      </div>

      {children}
    </section>
  );
}

export default function DoctorDashboard() {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("medikioskUser") || "null");

    if (!user || user.role !== "doctor") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSearch = async (event) => {
    event.preventDefault();

    setError("");
    setPatientData(null);

    if (!accessToken.trim()) {
      setError("Please enter the patient's access token.");
      return;
    }

    const authToken = sessionStorage.getItem("medikioskToken");

    if (!authToken) {
      setError("Your session has expired. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/consultations/doctor/lookup-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            accessToken: accessToken.trim(),
          }),
        },
      );

      const result = await response.json();

      if (response.status === 401) {
        sessionStorage.removeItem("medikioskToken");
        sessionStorage.removeItem("medikioskUser");
        navigate("/login");
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to retrieve patient report.");
      }

      setPatientData(result.data);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Please check your server."
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("medikioskToken");
    sessionStorage.removeItem("medikioskUser");
    navigate("/login");
  };

  const patient = patientData?.patient;
  const report = patientData?.report;

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#214A43]">
      {/* Sidebar - follows the patient dashboard's layout */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[216px] border-r border-[#E8EDE7] bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-[#E8EDE7] px-6">
          <div className="rounded-xl bg-[#47796F] p-2 text-white">
            <HeartPulse size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-[#214A43]">MediKiosk</h1>
            <p className="text-[10px] tracking-wider text-[#81958B]">
              HEALTHCARE PORTAL
            </p>
          </div>
        </div>

        <div className="px-5 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-[#9AAA9F]">
            Workspace
          </p>

          <div className="flex items-center gap-3 rounded-xl bg-[#EAF2EC] px-3 py-3 text-sm font-semibold text-[#315E54]">
            <Activity size={18} />
            Doctor Dashboard
          </div>
        </div>

        <div className="mt-auto border-t border-[#E8EDE7] p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-full bg-[#EAF2EC] p-2 text-[#47796F]">
              <Stethoscope size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#214A43]">
                Doctor Account
              </p>
              <p className="text-xs text-[#8A9B93]">Healthcare Professional</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#789087] transition hover:bg-[#F7F5EF] hover:text-red-600"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main className="min-h-screen lg:ml-[216px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between border-b border-[#E8EDE7] bg-[#FAF8F2]/95 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div>
            <h2 className="text-xl font-bold text-[#214A43]">
              Doctor Dashboard
            </h2>
            <p className="mt-1 text-xs text-[#82948B]">
              Access and review patient clinical reports
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#DCE8DF] bg-white px-3 py-2">
            <ShieldCheck size={17} className="text-[#47796F]" />
            <span className="text-xs font-semibold text-[#47796F]">
              Secure Access
            </span>
          </div>
        </header>

        <div className="space-y-6 px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
          {/* Welcome */}
          <section>
            <p className="text-sm font-medium text-[#789087]">Welcome back</p>

            <h1 className="mt-1 text-2xl font-bold text-[#214A43]">
              Patient Consultation
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#789087]">
              Enter the access token shared by your patient to securely retrieve
              their consultation report.
            </p>
          </section>

          {/* Token search */}
          <section className={cardClass}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-[#EDF4EF] p-3 text-[#47796F]">
                <Search size={21} />
              </div>

              <div>
                <h3 className="font-bold text-[#214A43]">
                  Find Patient Report
                </h3>
                <p className="mt-1 text-xs text-[#82948B]">
                  Enter the token provided by the patient
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={accessToken}
                onChange={(event) =>
                  setAccessToken(event.target.value.toUpperCase())
                }
                placeholder="Example: MK-A1B2C3D4E5F6"
                className="min-w-0 flex-1 rounded-xl border border-[#DCE5DC] bg-[#FCFDFC] px-4 py-3.5 text-sm font-semibold tracking-wider text-[#214A43] outline-none transition placeholder:font-normal placeholder:tracking-normal focus:border-[#47796F] focus:ring-4 focus:ring-[#47796F]/10"
              />

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#47796F] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#315E54] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Searching..."
                ) : (
                  <>
                    Search Report
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </section>

          {/* Initial empty state */}
          {!patientData && !loading && !error && (
            <div className="rounded-2xl border border-dashed border-[#D5E2D8] bg-white/70 px-5 py-14 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4EF] text-[#47796F]">
                <ClipboardList size={30} />
              </div>

              <h3 className="font-bold text-[#315E54]">No Patient Selected</h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8A9B93]">
                Enter a patient's access token above. Their consultation report
                will appear here.
              </p>
            </div>
          )}

          {/* Patient report */}
          {patientData && patient && report && (
            <div className="space-y-5">
              {/* Report heading */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={19} className="text-[#47796F]" />
                    <h2 className="text-lg font-bold text-[#214A43]">
                      Patient Report Retrieved
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-[#82948B]">
                    Report date: {formatDate(patientData.createdAt)}
                  </p>
                </div>

                <span className="rounded-full bg-[#EAF3EC] px-3 py-1.5 text-xs font-semibold text-[#47796F]">
                  Verified Token
                </span>
              </div>

              {/* Patient information */}
              <section className="rounded-2xl border border-[#DCE8DF] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2EC] text-[#47796F]">
                      <UserRound size={28} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#214A43]">
                        {patient.fullName}
                      </h2>
                      <p className="mt-1 text-sm text-[#82948B]">
                        Patient Information
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-[#F5F7F2] px-3 py-2 text-xs font-semibold text-[#52746D]">
                    {patient.bloodGroup || "Blood group not provided"}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#EDF0EA] pt-5 sm:grid-cols-2 lg:grid-cols-3">
                  <PatientInfo
                    icon={CalendarDays}
                    label="Age"
                    value={getAge(patient.dateOfBirth)}
                  />

                  <PatientInfo
                    icon={UserRound}
                    label="Gender"
                    value={patient.gender || "Not provided"}
                  />

                  <PatientInfo
                    icon={Phone}
                    label="Phone"
                    value={patient.phone || "Not provided"}
                  />

                  <PatientInfo
                    icon={Mail}
                    label="Email"
                    value={patient.email || "Not provided"}
                  />

                  <PatientInfo
                    icon={MapPin}
                    label="City"
                    value={patient.city || "Not provided"}
                  />

                  <PatientInfo
                    icon={CalendarDays}
                    label="Date of Birth"
                    value={formatDate(patient.dateOfBirth)}
                  />
                </div>
              </section>

              {/* Doctor summary */}
              <section className="rounded-2xl border border-[#CFE0D4] bg-[#EDF5EF] p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Activity size={20} className="text-[#47796F]" />
                  <h3 className="font-bold text-[#214A43]">Clinical Summary</h3>
                </div>

                <p className="text-sm leading-7 text-[#315E54]">
                  {report.doctorSummary || "No doctor summary provided."}
                </p>
              </section>

              {/* Chief complaint */}
              <ReportSection title="Chief Complaint" icon={ClipboardList}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <InfoBlock
                    label="Main Problem"
                    value={report.chiefComplaint?.problem}
                  />

                  <InfoBlock
                    label="Duration"
                    value={report.chiefComplaint?.duration}
                  />

                  <InfoBlock
                    label="Severity"
                    value={report.chiefComplaint?.severity}
                  />
                </div>
              </ReportSection>

              {/* Symptoms */}
              <ReportSection title="Reported Symptoms" icon={Activity}>
                <ValueList items={report.symptoms} />
              </ReportSection>

              {/* Important values */}
              <ReportSection
                title="Important Clinical Values"
                icon={HeartPulse}
              >
                {Array.isArray(report.keyValues) &&
                report.keyValues.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {report.keyValues.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#E6ECE5] bg-[#FAFCF9] p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#82948B]">
                          {item.label || "Clinical Value"}
                        </p>

                        <p className="mt-2 text-lg font-bold text-[#214A43]">
                          {item.value || "Not provided"}
                        </p>

                        <p className="mt-1 text-xs text-[#82948B]">
                          Source: {item.source || "Not specified"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ValueList items={report.keyValues} />
                )}
              </ReportSection>

              {/* History */}
              <ReportSection title="Medical History" icon={FileText}>
                <ValueList items={report.medicalHistory} />
              </ReportSection>

              {/* Allergies and medicines */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <ReportSection title="Known Allergies" icon={AlertCircle}>
                  <ValueList items={report.allergies} />
                </ReportSection>

                <ReportSection title="Current Medications" icon={HeartPulse}>
                  <ValueList items={report.medications} />
                </ReportSection>
              </div>

              {/* Document findings */}
              <ReportSection title="Uploaded Document Findings" icon={FileText}>
                {Array.isArray(report.documentFindings) &&
                report.documentFindings.length > 0 ? (
                  <div className="space-y-3">
                    {report.documentFindings.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-[#E6ECE5] bg-[#FAFCF9] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-semibold text-[#315E54]">
                            {item.name || "Uploaded Document"}
                          </h4>

                          {item.status && (
                            <span className="rounded-full bg-[#EAF2EC] px-3 py-1 text-xs font-semibold text-[#47796F]">
                              {item.status}
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-[#52746D]">
                          {item.finding || "No finding provided."}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#8A9B93]">
                    No document findings provided.
                  </p>
                )}
              </ReportSection>

              {/* Original uploaded documents and X-rays */}
              <PatientDocuments
                documents={patientData.documents || []}
                reportId={patientData.reportId}
                accessToken={accessToken}
              />

              {/* Interactive DICOM Medical Scan Viewer */}
              <DicomViewer
                documents={patientData.documents || []}
                reportId={patientData.reportId}
                accessToken={accessToken}
               /> 

              {/* Missing information */}
              <ReportSection title="Missing Information" icon={AlertCircle}>
                <ValueList items={report.missingInformation} />
              </ReportSection>

              {/* Footer note */}
              <div className="rounded-xl border border-[#E7EAE3] bg-white px-4 py-3 text-xs leading-6 text-[#82948B]">
                This report is an AI-generated clinical summary based on the
                information supplied by the patient and uploaded documents.
                Verify relevant details with the patient and original documents
                before making clinical decisions.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PatientInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="rounded-lg bg-[#F0F5F0] p-2 text-[#47796F]">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-[#82948B]">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-[#315E54]">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F7F9F5] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#82948B]">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold leading-6 text-[#315E54]">
        {value || "Not provided"}
      </p>
    </div>
  );
}
