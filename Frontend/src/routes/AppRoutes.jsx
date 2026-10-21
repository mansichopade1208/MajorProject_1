import { Routes, Route, Link, Outlet, Navigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

import Home from "../pages/Home.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";

import PatientDashboard from "../pages/patient/PatientDashboard.jsx";
import MyDocuments from "../pages/patient/MyDocuments.jsx";
import MedicalHistory from "../pages/patient/MedicalHistory.jsx";
import MyComplaints from "../pages/patient/MyComplaints.jsx";
import MyConsultations from "../pages/patient/MyConsultations.jsx";
import Profile from "../pages/patient/Profile.jsx";
import Help from "../pages/patient/Help.jsx";
import NewConsultation from "../pages/patient/NewConsultation.jsx";

import DoctorDashboard from "../pages/DoctorDashboard.jsx";
import Sidebar from "../components/patient/Sidebar.jsx";

// 404 - Page Not Found
function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-5xl text-[#214A43]">404</h1>

      <p className="mt-3 text-[#52746D]">
        Sorry, this page could not be found.
      </p>

      <Link
        to="/"
        className="mt-5 rounded-xl bg-[#47796F] px-5 py-3 font-semibold text-white transition hover:bg-[#315E54]"
      >
        Return Home
      </Link>
    </main>
  );
}

// Shared layout for all patient pages
function PatientLayout() {
  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Sidebar />

      <main className="min-h-screen px-4 py-5 sm:px-7 lg:ml-[216px] lg:px-9 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Routes>
        {/* Public pages: navbar and footer */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        <Route
          path="/signup"
          element={
            <>
              <Navbar />
              <Signup />
              <Footer />
            </>
          }
        />

        <Route
          path="/patient/register"
          element={<Navigate to="/signup" replace />}
        />

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />

        <Route
          path="/doctor/login"
          element={
            <>
              <Navbar />
              <Login />
              <Footer />
            </>
          }
        />

        {/* Patient pages: shared sidebar, no public navbar/footer */}
        <Route path="/patient" element={<PatientLayout />}>
          <Route index element={<Navigate to="/patient/dashboard" replace />} />

          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="documents" element={<MyDocuments />} />
          <Route path="history" element={<MedicalHistory />} />
          <Route path="complaints" element={<MyComplaints />} />
          <Route path="consultations" element={<MyConsultations />} />
          <Route path="profile" element={<Profile />} />
          <Route path="help" element={<Help />} />
          <Route path="consultation/new" element={<NewConsultation />} />
        </Route>

        {/* Doctor dashboard */}
        <Route
          path="/doctor/dashboard"
          element={
            <>
              <Navbar />
              <DoctorDashboard />
              <Footer />
            </>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <NotFound />
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
