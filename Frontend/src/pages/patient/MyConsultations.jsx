import PatientSubPage from "./PatientSubPage";

export default function MyConsultations() {
  return (
    <PatientSubPage
      title="My Consultations"
      description="View your consultation records and check their submission and review status."
      actionLabel="Start New Consultation"
      actionPath="/patient/consultation/new"
    />
  );
}