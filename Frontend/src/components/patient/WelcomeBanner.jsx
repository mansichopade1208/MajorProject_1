import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WelcomeBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl bg-[#E0EBE3] px-6 py-7 sm:px-8 sm:py-9">
      <div className="relative z-10 max-w-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#47796E]">
          Welcome to MediKiosk
        </p>

        <h2 className="max-w-md text-2xl font-bold leading-tight text-[#214D43] sm:text-3xl">
          Your health, our priority.
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#385E54] sm:text-base">
          Start a new consultation or keep track of your medical information.
        </p>

        <button
          onClick={() => navigate("/patient/consultation/new")}
          className="mt-5 inline-flex items-center gap-3 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#285C50] focus:outline-none focus:ring-2 focus:ring-[#47796E] focus:ring-offset-2"
        >
          <Plus size={20} />
          Start New Consultation
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Decorative illustration — replace with your own asset if available */}
      <div className="pointer-events-none absolute -bottom-12 -right-5 hidden h-64 w-64 items-center justify-center rounded-full bg-[#C9DED1] sm:flex lg:right-8">
        <div className="flex h-40 w-32 -rotate-6 flex-col items-center rounded-xl border-4 border-[#47796E] bg-[#FFFDF8] p-4 shadow-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#47796E] text-white">
            <Plus size={28} strokeWidth={3} />
          </div>
          <div className="mt-4 w-full space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm border-2 border-[#47796E]" />
                <span className="h-1.5 flex-1 rounded-full bg-[#D9E5DC]" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-9 right-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C58F7B] text-white shadow-sm">
          <span className="text-3xl">♡</span>
        </div>
      </div>
    </section>
  );
}