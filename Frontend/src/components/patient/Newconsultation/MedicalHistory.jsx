
import { useState } from "react";
import { Send, ClipboardList, Pencil } from "lucide-react";

export default function MedicalHistory({ onComplete }) {
  const [history, setHistory] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const text = history.trim();
    if (!text) return;

    onComplete(text);
    setHistory(text);
    setSubmitted(true);
  }

  function handleEdit() {
    setSubmitted(false);
  }

  return (
    <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
          <ClipboardList size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-[#214D43]">
            Your medical history
          </h2>
          <p className="text-sm text-gray-500">
            Share your past illnesses, allergies and medications.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="mt-5 rounded-xl border border-[#DCE5DC] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#214D43]">
              Medical history submitted
            </h3>

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#47796E] hover:underline"
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {history}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5">
          <label
            htmlFor="medical-history"
            className="mb-2 block text-sm font-medium text-[#315F53]"
          >
            Medical history, allergies and medications
          </label>

          <textarea
            id="medical-history"
            value={history}
            onChange={(event) => setHistory(event.target.value)}
            placeholder="For example: I have diabetes, I am allergic to penicillin, and I currently take..."
            rows={5}
            maxLength={5000}
            required
            className="w-full resize-y rounded-xl border border-[#DCE5DC] bg-white p-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#47796E] focus:ring-2 focus:ring-[#E0EEE7]"
          />

          <p className="mt-2 text-right text-xs text-gray-400">
            {history.length}/5000
          </p>

          <button
            type="submit"
            disabled={!history.trim()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
