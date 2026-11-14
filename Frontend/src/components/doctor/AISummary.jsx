
import {
  Sparkles,
  Stethoscope,
  ClipboardList,
  Plus,
  Pill,
  Users,
  Activity,
  Pencil,
  Check,
} from "lucide-react";

import { summaryFields } from "../../data/doctorDashboardData";

const iconMap = {
  stethoscope: Stethoscope,
  clipboard: ClipboardList,
  medical: Plus,
  pill: Pill,
  users: Users,
  activity: Activity,
};

export default function AISummary({
  patient,
  onEdit,
  onMarkReviewed,
}) {
  if (!patient) {
    return (
      <section className="bg-white rounded-2xl p-8 text-center">
        <p>No patient selected.</p>
      </section>
    );
  }

  return (
    <section className="bg-white border border-[#d9e0d9]
    rounded-2xl shadow-sm overflow-hidden h-fit">

      {/* Header */}

      <div className="bg-gradient-to-r from-[#214A43] to-[#28685B] text-white px-5 py-5">

        <div className="flex flex-wrap justify-between
        items-center gap-3">

          <div className="flex items-center gap-2">
            <Sparkles size={25} />
            <h2 className="text-xl font-bold">AI Summary</h2>

            <span className="text-xs bg-[#b9e2d2] text-[#285e4e]
            px-3 py-1 rounded-full">
              {patient.status === "Reviewed" ? "Reviewed" : "Draft"}
            </span>
          </div>

          <span className="text-xs text-white/80">
            Last updated: {patient.date}
          </span>

        </div>
      </div>

      <div className="p-4 sm:p-5">

        {/* Patient information */}

        <div className="bg-[#f0f5ef] rounded-xl p-3 mb-4
        flex justify-between items-center gap-3">

          <div>
            <p className="text-xs text-[#71857d]">
              Selected Patient
            </p>
            <p className="font-semibold mt-1">
              {patient.name}
            </p>
          </div>

          <span className="text-xs bg-white px-3 py-2 rounded-full">
            {patient.date}
          </span>
        </div>

        {/* Summary sections */}

        <div>
          {summaryFields.map((field) => {
            const Icon = iconMap[field.icon];

            return (
              <div key={field.key}
              className="flex gap-4 py-4 border-b border-[#e9e8e1]">

                <div className="w-14 h-14 shrink-0 rounded-full
                bg-[#DCEBE3] flex items-center justify-center">
                  <Icon size={27} className="text-[#426d60]" />
                </div>

                <div className="min-w-0 pt-1">
                  <h3 className="font-semibold text-[15px]
                  text-[#24483f]">
                    {field.title}
                  </h3>

                  <p className="text-sm text-[#263d4a]
                  leading-6 mt-1">
                    {patient.summary[field.key] || "Not provided."}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* Actions */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

          <button
            onClick={onEdit}
            className="border border-[#527c70] text-[#315c51]
            rounded-xl py-3 px-3 font-semibold text-sm
            flex items-center justify-center gap-2
            hover:bg-[#edf4ef]"
          >
            <Pencil size={17} />
            Edit Summary
          </button>

          <button
            onClick={onMarkReviewed}
            disabled={patient.status === "Reviewed"}
            className="bg-[#527c70] text-white rounded-xl
            py-3 px-3 font-semibold text-sm
            flex items-center justify-center gap-2
            hover:bg-[#345e54] disabled:opacity-60"
          >
            <Check size={19} />
            {patient.status === "Reviewed"
              ? "Reviewed"
              : "Mark as Reviewed"}
          </button>

        </div>
      </div>
    </section>
  );
}
