import { Info, Sparkles, FileText } from "lucide-react";

export default function HealthSummary({ summary = null }) {
  return (
    <section className="rounded-2xl border border-[#E7E7DF] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={21} className="text-[#47796E]" />
          <h2 className="text-lg font-bold text-[#214D43]">
            Your Health Summary
          </h2>
        </div>

        <span
          title="The AI summary is a draft for review, not a diagnosis."
          className="flex items-center gap-1 text-xs text-gray-500"
        >
          Powered by AI <Info size={15} />
        </span>
      </div>

      {summary ? (
        <div className="rounded-xl bg-[#EAF2EC] p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#326F61]">
            <FileText size={18} />
            Summary available
          </div>

          <p className="whitespace-pre-wrap text-sm leading-6 text-[#36594F]">
            {summary}
          </p>

          <p className="mt-4 text-xs text-gray-500">
            This summary is provided for review and does not replace a
            healthcare professional's assessment.
          </p>
        </div>
      ) : (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl bg-[#E7EFE8] px-5 py-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/70 text-[#47796E]">
            <FileText size={39} strokeWidth={1.5} />
          </div>

          <p className="mt-5 max-w-xs text-base font-medium leading-6 text-[#214D43]">
            Your AI summary will appear here once you submit your details.
          </p>

          <p className="mt-2 text-xs leading-5 text-[#64776F]">
            Your doctor should review the summary before relying on it.
          </p>
        </div>
      )}
    </section>
  );
}