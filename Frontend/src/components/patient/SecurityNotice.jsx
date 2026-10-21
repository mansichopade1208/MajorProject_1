import { ShieldCheck } from "lucide-react";

export default function SecurityNotice() {
  return (
    <section className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#DFE9DF] bg-[#E5EEE5] p-5 sm:p-6">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#326F61] text-white">
        <ShieldCheck size={28} />
      </span>

      <div className="relative z-10">
        <h2 className="font-bold text-[#214D43]">
          Your information is secure
        </h2>
        <p className="mt-1 text-sm leading-5 text-[#5D7369]">
          Your medical information should only be accessible to authorized
          people according to your consent and the platform's access rules.
        </p>
      </div>
    </section>
  );
}