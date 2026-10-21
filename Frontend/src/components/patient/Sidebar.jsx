import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Plus,
  LayoutDashboard,
  FileText,
  HeartPulse,
  ClipboardList,
  UserRound,
  CircleHelp,
  Headset,
  LogOut,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/patient/dashboard", icon: LayoutDashboard },
  { label: "My Documents", path: "/patient/documents", icon: FileText },
  { label: "Medical History", path: "/patient/history", icon: HeartPulse },
  {
    label: "My Consultations",
    path: "/patient/consultations",
    icon: ClipboardList,
  },
  { label: "Profile", path: "/patient/profile", icon: UserRound },
  { label: "Help", path: "/patient/help", icon: CircleHelp },
];

export default function Sidebar({ mobile = false }) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    // Replace with your existing authentication logout function.
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex-col bg-[#17483F] px-4 py-6 text-white ${
          mobile ? "flex w-full" : "hidden w-[216px] lg:flex"
        }`}
      >
        <NavLink
          to="/patient/dashboard"
          className="mb-12 flex items-center gap-2.5 px-1"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F8878]">
            <Plus size={29} strokeWidth={3.5} />
          </span>

          <span>
            <span className="block text-lg font-bold tracking-tight">
              MediKiosk
            </span>
            <span className="block text-[10px] text-[#D1E3DC]">
              Patient portal
            </span>
          </span>
        </NavLink>

        <nav className="flex-1 space-y-2">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#F6F7F1] font-semibold text-[#17483F] shadow-sm"
                    : "text-[#E0EDE7] hover:bg-white/10"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="rounded-xl border border-white/10 bg-white/[0.08] p-3">
          <div className="flex items-center gap-2">
            <Headset size={20} />
            <p className="text-sm font-semibold">Need help?</p>
          </div>
          <p className="mt-1 text-xs text-[#D1E3DC]">
            Contact support if you need assistance.
          </p>
          <button
            onClick={() => navigate("/patient/help")}
            className="mt-3 w-full rounded-lg border border-white/50 py-2 text-sm hover:bg-white/10"
          >
            Contact support
          </button>
        </div>

        <button
          onClick={() => setShowLogout(true)}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/50 py-3 text-sm font-medium hover:bg-white/10"
        >
          <LogOut size={17} />
          Log Out
        </button>
      </aside>

      {/* Logout confirmation */}
      {showLogout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-[#244E45] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="logout-title" className="text-lg font-bold">
                Log out?
              </h2>
              <button
                onClick={() => setShowLogout(false)}
                aria-label="Close dialog"
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to leave your patient portal?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-[#47796E] px-4 py-2 text-sm font-medium text-white"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
