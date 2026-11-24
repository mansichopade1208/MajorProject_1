
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus,
  LayoutDashboard,
  FileText,
  X,
  Headset,
  LogOut,
} from "lucide-react";

export default function DoctorSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Doctor Dashboard",
      icon: LayoutDashboard,
      path: "/doctor/dashboard",
    },
    {
      label: "Patient Reports",
      icon: FileText,
      path: "/doctor/patient-reports",
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("medikioskToken");
    sessionStorage.removeItem("medikioskUser");
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40
        w-[216px] h-screen
        bg-[#17483F] text-white
        flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-[110px] px-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#2F8878] rounded-xl p-2">
              <Plus size={27} strokeWidth={3.5} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              MediKiosk
            </span>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-5 space-y-2">
          {menuItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3
                  rounded-xl px-3 py-3 text-sm transition-colors
                  ${
                    isActive
                      ? "bg-[#F6F7F1] font-semibold text-[#17483F] shadow-sm"
                      : "text-[#E0EDE7] hover:bg-white/10"
                  }`}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-5">
          <div className="rounded-xl border border-white/10
            bg-white/[0.08] p-3">
            <div className="flex items-center gap-2">
              <Headset size={20} />
              <p className="text-sm font-semibold">Need help?</p>
            </div>

            <p className="mt-1 text-xs text-[#D1E3DC]">
              Contact support if you need assistance.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center
              justify-center gap-2 rounded-xl
              border border-white/50 py-3 text-sm
              hover:bg-white/10 transition"
          >
            <LogOut size={17} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
