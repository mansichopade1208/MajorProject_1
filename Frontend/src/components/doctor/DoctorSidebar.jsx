
import { useNavigate } from "react-router-dom";
import {
  Plus,
  LayoutDashboard,
  Users,
  FileCheck2,
  Settings,
  X,
  Headset,
  LogOut,
} from "lucide-react";

export default function DoctorSidebar({ open, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/doctor/dashboard" },
    { label: "Patients", icon: Users, path: "/doctor/patients" },
    { label: "Reviews", icon: FileCheck2, path: "/doctor/reviews" },
    { label: "Settings", icon: Settings, path: "/doctor/settings" },
  ];

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
        />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-40
        w-[235px] h-screen shrink-0
        bg-gradient-to-b from-[#214A43] to-[#173B35]
        text-white flex flex-col transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

        <div className="h-[110px] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#DCEBE3] rounded-xl p-2">
              <Plus size={27} className="text-[#214A43]" strokeWidth={4} />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              MediKiosk
            </span>
          </div>

          <button onClick={onClose} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        <nav className="px-4 space-y-3 mt-5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-4
                  px-4 py-4 rounded-xl transition text-left
                  ${index === 0
                    ? "bg-[#E5F0E9] text-[#214A43] shadow-sm"
                    : "text-white hover:bg-white/10"}`}
              >
                <Icon size={23} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-4 pb-5 space-y-3">
          <div className="bg-white/10 border border-white/10
            rounded-2xl p-4 flex items-center gap-3">
            <Headset size={26} />
            <div>
              <p className="font-semibold text-sm">Need help?</p>
              <p className="text-xs text-white/75 mt-1">
                Contact support
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full border border-white/60 rounded-xl
              py-3 flex items-center justify-center gap-2
              hover:bg-white/10 transition"
          >
            <LogOut size={19} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
