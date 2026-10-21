import PatientSubPage from "./PatientSubPage";

export default function MedicalHistory() {
  return (
    <PatientSubPage
      title="Medical History"
      description="Record and review your past illnesses, ongoing conditions, medications, allergies and surgeries."
      actionLabel="Add Medical Details"
      actionPath="/patient/consultation/new"
    />
  );
}