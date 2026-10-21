import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function PatientLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F7F1] text-[#214D43]">
      <Sidebar />

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="absolute inset-y-0 left-0 w-[260px]">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 z-10 rounded-lg p-2 text-white hover:bg-white/10"
            >
              <X size={22} />
            </button>
            <Sidebar mobile />
          </div>
        </div>
      )}

      <main className="min-h-screen px-4 py-5 sm:px-7 sm:py-7 lg:ml-[216px] lg:px-9 lg:py-8">
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
            className="inline-flex items-center gap-2 rounded-lg border border-[#DDE5DC] bg-white px-3 py-2 text-sm font-medium"
          >
            <Menu size={19} /> Menu
          </button>
        </div>

        <Outlet />
      </main>
    </div>
  );
}