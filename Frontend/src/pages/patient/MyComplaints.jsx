import PatientSubPage from "./PatientSubPage";

export default function MyComplaints() {
  return (
    <PatientSubPage
      title="My Complaints"
      description="Describe your current health concerns through a guided, conversational interview."
      actionLabel="Start Health Interview"
      actionPath="/patient/consultation/new"
    />
  );
}