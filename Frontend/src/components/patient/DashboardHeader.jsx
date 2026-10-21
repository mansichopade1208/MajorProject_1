import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, UserRound, X } from "lucide-react";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm text-[#64776F]">{formattedDate}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#214D43] sm:text-4xl">
          Namaste, Rahul
        </h1>
        <p className="mt-1 text-sm text-[#64776F] sm:text-base">
          Your personal health space
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileOpen(false);
            }}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="rounded-full p-2.5 text-[#214D43] transition hover:bg-[#E5EEE7]"
          >
            <Bell size={22} />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-[#E3E7DF] bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#214D43]">
                  Notifications
                </h2>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  aria-label="Close notifications"
                >
                  <X size={17} />
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                You're all caught up. New consultation updates will appear
                here.
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotificationsOpen(false);
            }}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-full hover:bg-[#E5EEE7]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5E4DA] bg-[#E4EEE6] text-sm font-semibold text-[#214D43]">
              RK
            </span>
            <ChevronDown size={15} className="text-[#64776F]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-[#E3E7DF] bg-white p-2 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="font-semibold text-[#214D43]">Rahul Kumar</p>
                <p className="text-xs text-gray-500">Patient account</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/patient/profile");
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#F0F5F0]"
              >
                <UserRound size={16} />
                My Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}