
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Menu,
  UserRound,
  LogOut,
} from "lucide-react";

export default function DoctorHeader({
  onMenuClick,
  pendingCount,
}) {
  const navigate = useNavigate();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="min-h-[125px] px-5 sm:px-8 py-6
    flex justify-between items-center gap-4">

      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden">
          <Menu size={25} />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Doctor Dashboard
          </h1>
          <p className="text-[#52645f] mt-1">
            Welcome back, Dr. Sharma!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">

        <div className="relative">
          <button
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setProfileOpen(false);
            }}
            className="relative p-2 rounded-full hover:bg-white"
          >
            <Bell size={25} />

            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5
              bg-[#df8b76] rounded-full" />
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-12 z-50 w-72
            bg-white shadow-xl border rounded-xl p-4">
              <h3 className="font-semibold mb-3">
                Notifications
              </h3>

              <p className="text-sm bg-[#f0f5ef] p-3 rounded-lg">
                You have {pendingCount} pending patient reviews.
              </p>
            </div>
          )}
        </div>

        <div className="h-9 w-px bg-[#deded5]" />

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#527c70]
            text-white flex items-center justify-center font-semibold">
              DS
            </div>

            <span className="hidden sm:block font-medium">
              Dr. Sharma
            </span>

            <ChevronDown size={17} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-48
            bg-white shadow-xl border rounded-xl p-2">

              <button
                onClick={() => navigate("/doctor/settings")}
                className="flex items-center gap-3 p-3 w-full
                hover:bg-[#f0f5ef] rounded-lg text-sm"
              >
                <UserRound size={17} />
                My Profile
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-3 p-3 w-full
                hover:bg-[#f0f5ef] rounded-lg text-sm text-red-600"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
