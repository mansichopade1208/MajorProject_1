
import { useState, useMemo } from "react";

import DoctorSidebar from "../../components/doctor/DoctorSidebar";
import DoctorHeader from "../../components/doctor/DoctorHeader";
import DashboardStats from "../../components/doctor/DashboardStats";
import RecentPatients from "../../components/doctor/RecentPatients";
import QuickActions from "../../components/doctor/QuickActions";
import AISummary from "../../components/doctor/AISummary";
import EditSummaryModal from "../../components/doctor/EditSummaryModal";

import { initialPatients } from "../../data/doctorDashboardData";

export default function DoctorDashboard() {

  // Patient state
  const [patients, setPatients] = useState(initialPatients);

  // Selected patient
  const [selectedPatientId, setSelectedPatientId] = useState(1);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modal
  const [editOpen, setEditOpen] = useState(false);

  // Editable summary
  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId),
    [patients, selectedPatientId]
  );

  const [editSummary, setEditSummary] = useState({});

  // Statistics
  const pendingCount = patients.filter(
    (p) => p.status === "Pending"
  ).length;

  const reviewedCount = patients.filter(
    (p) => p.status === "Reviewed"
  ).length;

  // Select patient
  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
  };

  // Open edit modal
  const handleEdit = () => {
    setEditSummary({ ...selectedPatient.summary });
    setEditOpen(true);
  };

  // Edit summary field
  const handleSummaryChange = (key, value) => {
    setEditSummary((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Save summary
  const handleSaveSummary = () => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === selectedPatientId
          ? {
              ...patient,
              summary: { ...editSummary },
            }
          : patient
      )
    );

    setEditOpen(false);
  };

  // Mark patient reviewed
  const handleMarkReviewed = () => {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === selectedPatientId
          ? { ...patient, status: "Reviewed" }
          : patient
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF7F1]
    text-[#214A43] flex">

      {/* Sidebar */}

      <DoctorSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}

      <main className="flex-1 min-w-0 overflow-hidden">

        {/* Header */}

        <DoctorHeader
          onMenuClick={() => setSidebarOpen(true)}
          pendingCount={pendingCount}
        />

        <div className="px-5 sm:px-7 lg:px-8 pb-8">

          <div className="grid grid-cols-1 2xl:grid-cols-[1.45fr_0.95fr]
          gap-5">

            {/* Left column */}

            <div className="min-w-0 space-y-6">

              <DashboardStats
                totalPatients={128}
                pendingCount={pendingCount}
                reviewedCount={112 + reviewedCount - 2}
                newToday={24}
              />

              <RecentPatients
                patients={patients}
                selectedPatientId={selectedPatientId}
                onSelectPatient={handleSelectPatient}
              />

              <QuickActions />

            </div>

            {/* Right column */}

            <div>
              <AISummary
                patient={selectedPatient}
                onEdit={handleEdit}
                onMarkReviewed={handleMarkReviewed}
              />
            </div>

          </div>
        </div>
      </main>

      {/* Edit modal */}

      <EditSummaryModal
        open={editOpen}
        summary={editSummary}
        patientName={selectedPatient?.name}
        onChange={handleSummaryChange}
        onSave={handleSaveSummary}
        onClose={() => setEditOpen(false)}
      />

    </div>
  );
}
