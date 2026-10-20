
import { Routes, Route } from "react-router-dom";

import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";

import Home from "../pages/Home.jsx";
// import About from "../pages/About";
// import PatientLogin from "../pages/PatientLogin";
// import DoctorLogin from "../pages/DoctorLogin";

function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-5xl text-[#214A43]">
        404
      </h1>
      <p className="mt-3 text-[#52746D]">
        Sorry, this page could not be found.
      </p>
      <a
        href="/"
        className="mt-5 rounded-xl bg-[#47796F] px-5 py-3 font-semibold text-white"
      >
        Return Home
      </a>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <div className="min-h-screen bg-[#FAF8F2]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/patient/register" element={<PatientLogin />} />
        <Route path="/doctor/login" element={<DoctorLogin />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}
