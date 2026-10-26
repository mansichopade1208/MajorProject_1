
import {
  ClipboardList,
  FileText,
  MessageCircle,
  Send,
} from "lucide-react";

export default function ConsultationReview({
  interviewSummary,
  medicalHistory,
  medicalDocuments = [],
  onSubmit,
}) {
  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Patient problem */}
      <section className="rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
            <MessageCircle size={21} />
          </div>

          <h2 className="font-semibold text-[#214D43]">
            Patient problem
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {interviewSummary || "No interview summary available."}
        </p>
      </section>

      {/* Medical history */}
      <section className="rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
            <ClipboardList size={21} />
          </div>

          <h2 className="font-semibold text-[#214D43]">
            Medical history
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {medicalHistory || "No medical history provided."}
        </p>
      </section>

      {/* Uploaded documents */}
      <section className="rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
            <FileText size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-[#214D43]">
              Medical documents
            </h2>
            <p className="text-sm text-gray-500">
              {medicalDocuments.length} PDF
              {medicalDocuments.length === 1 ? "" : "s"} selected
            </p>
          </div>
        </div>

        {medicalDocuments.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No documents uploaded.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {medicalDocuments.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-[#DCE5DC] bg-white p-3"
              >
                <FileText
                  size={20}
                  className="shrink-0 text-[#47796E]"
                />

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-[#214D43]">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF · {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm leading-5 text-gray-500">
        Please check that the information above is correct before submitting.
      </p>

     
    </div>
  );
}
