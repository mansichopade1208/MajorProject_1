import PatientSubPage from "./PatientSubPage";

export default function MyDocuments() {
  return (
    <PatientSubPage
      title="My Documents"
      description="Upload and view your medical reports, prescriptions and other health documents."
      actionLabel="Start a Consultation"
      actionPath="/patient/consultation/new"
    />
  );
}