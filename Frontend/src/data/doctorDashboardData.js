
export const initialPatients = [
  {
    id: 1,
    name: "Riya Mehta",
    complaint: "Fever and cough",
    date: "Apr 10, 2025",
    status: "Pending",
    summary: {
      chiefComplaint: "Fever with cough and body ache for 3 days.",
      hpi: "Patient developed sudden onset fever (102°F) 3 days back with dry cough, sore throat and generalized body ache.",
      medicalHistory: "No significant past medical history.",
      allergies: "No known drug allergies. Not on any regular medication.",
      familyHistory: "No significant family history.",
      review: "Positive for fever, cough, body ache, tiredness.",
    },
  },
  {
    id: 2,
    name: "Aarav Patel",
    complaint: "Headache",
    date: "Apr 9, 2025",
    status: "Reviewed",
    summary: {
      chiefComplaint: "Persistent headache for 2 days.",
      hpi: "Patient reports intermittent headache for 2 days.",
      medicalHistory: "No significant past medical history.",
      allergies: "No known allergies.",
      familyHistory: "No significant family history.",
      review: "Headache and mild fatigue.",
    },
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    complaint: "Stomach pain",
    date: "Apr 8, 2025",
    status: "Reviewed",
    summary: {
      chiefComplaint: "Abdominal pain since yesterday.",
      hpi: "Patient reports abdominal discomfort after meals.",
      medicalHistory: "No significant past medical history.",
      allergies: "No known allergies.",
      familyHistory: "No significant family history.",
      review: "Mild abdominal discomfort.",
    },
  },
  {
    id: 4,
    name: "Vikram Rao",
    complaint: "Cold and sore throat",
    date: "Apr 7, 2025",
    status: "Pending",
    summary: {
      chiefComplaint: "Cold and sore throat for 2 days.",
      hpi: "Patient reports nasal congestion and sore throat.",
      medicalHistory: "No significant past medical history.",
      allergies: "No known allergies.",
      familyHistory: "No significant family history.",
      review: "Positive for sore throat and nasal congestion.",
    },
  },
];

export const summaryFields = [
  {
    key: "chiefComplaint",
    title: "Chief Complaint",
    icon: "stethoscope",
  },
  {
    key: "hpi",
    title: "History of Present Illness (HPI)",
    icon: "clipboard",
  },
  {
    key: "medicalHistory",
    title: "Past Medical History",
    icon: "medical",
  },
  {
    key: "allergies",
    title: "Drug & Allergy History",
    icon: "pill",
  },
  {
    key: "familyHistory",
    title: "Family History",
    icon: "users",
  },
  {
    key: "review",
    title: "Review of Systems",
    icon: "activity",
  },
];
