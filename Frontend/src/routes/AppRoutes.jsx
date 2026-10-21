
import { Routes, Route, Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

import Home from "../pages/Home.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";

import PatientDashboard from "../pages/PatientDashboard.jsx";
import DoctorDashboard from "../pages/DoctorDashboard.jsx";

// 404 - Page Not Found
function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-5xl text-[#214A43]">
        404
      </h1>

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

export default function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Navbar />

      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Signup / Registration */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/patient/register" element={<Signup />} />

        {/* Login pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/doctor/login" element={<Login />} />

        {/* Patient dashboard */}
        <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        />

        {/* Doctor dashboard */}
        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />

        {/* 404 - Unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
