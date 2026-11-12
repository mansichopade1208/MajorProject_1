
import { X } from "lucide-react";
import { summaryFields } from "../../data/doctorDashboardData";

export default function EditSummaryModal({
  open,
  summary,
  onChange,
  onSave,
  onClose,
  patientName,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40
    flex items-center justify-center p-4">

      <div className="bg-[#FAF7F1] rounded-2xl w-full max-w-2xl
      max-h-[90vh] overflow-y-auto shadow-2xl">

        <div className="flex justify-between items-center p-5
        border-b border-[#e8dfd6] sticky top-0 bg-[#FAF7F1] z-10">

          <div>
            <h2 className="text-xl font-bold">
              Edit AI Summary
            </h2>
            <p className="text-sm text-[#71857d] mt-1">
              {patientName}
            </p>
          </div>

          <button onClick={onClose}>
            <X size={23} />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {summaryFields.map((field) => (
            <div key={field.key}>
              <label className="block font-semibold text-sm mb-2">
                {field.title}
              </label>

              <textarea
                rows={3}
                value={summary[field.key] || ""}
                onChange={(e) =>
                  onChange(field.key, e.target.value)
                }
                className="w-full border border-[#dce3dc]
                rounded-xl p-3 text-sm outline-none
                focus:ring-2 focus:ring-[#8aada0]
                resize-y bg-white"
              />
            </div>
          ))}

        </div>

        <div className="p-5 border-t border-[#e8dfd6]
        flex justify-end gap-3 sticky bottom-0 bg-[#FAF7F1]">

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border
            border-[#527c70] text-[#315c51]"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-5 py-2.5 rounded-xl bg-[#527c70]
            text-white hover:bg-[#345e54]"
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}
