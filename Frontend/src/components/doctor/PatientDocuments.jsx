
import { useEffect, useState } from "react";
import { FileImage, FileText, Eye, X } from "lucide-react";

const API_URL = "http://localhost:5000/api";

function formatSize(bytes) {
  if (!bytes) return "";
  return bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PatientDocuments({
  documents = [],
  reportId,
  accessToken,
}) {
  const [selected, setSelected] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selected) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selected.blob);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selected]);

  async function viewDocument(document) {
    try {
      setError("");
      setLoadingId(document._id);

      const token = sessionStorage.getItem("medikioskToken");

      const response = await fetch(
        `${API_URL}/consultations/doctor/${reportId}/documents/${document._id}/file`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Report-Access-Token": accessToken,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(
          result.message || "Unable to open document."
        );
      }

      const blob = await response.blob();

      setSelected({
        document,
        blob,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-[#E6EAE2] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#EDF4EF] p-2.5 text-[#47796F]">
            <FileImage size={20} />
          </div>

          <div>
            <h3 className="font-bold text-[#214A43]">
              Uploaded Medical Documents & X-rays
            </h3>
            <p className="mt-1 text-xs text-[#82948B]">
              Original files uploaded with this consultation
            </p>
          </div>
        </div>

        {documents.length === 0 ? (
          <p className="text-sm text-[#8A9B93]">
            No documents or X-rays were uploaded.
          </p>
        ) : (
          <div className="space-y-3">
            {documents.map((document) => {
              const isImage = document.mimeType?.startsWith("image/");

              return (
                <div
                  key={document._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E6ECE5] bg-[#FAFCF9] p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-[#EAF2EC] p-2 text-[#47796F]">
                      {isImage ? (
                        <FileImage size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="break-all text-sm font-semibold text-[#315E54]">
                        {document.originalName}
                      </p>

                      <p className="mt-1 text-xs text-[#82948B]">
                        {document.category || "Medical document"}
                        {" · "}
                        {formatSize(document.fileSize)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => viewDocument(document)}
                    disabled={loadingId === document._id}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#47796F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#315E54] disabled:opacity-60"
                  >
                    <Eye size={15} />
                    {loadingId === document._id
                      ? "Opening..."
                      : "View"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </section>

      {selected && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white">
            <div className="flex items-center justify-between border-b border-[#E6ECE5] p-4">
              <h3 className="break-all pr-3 text-sm font-bold text-[#214A43]">
                {selected.document.originalName}
              </h3>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-[#F4F6F3] p-3">
              {selected.document.mimeType === "application/pdf" ? (
                <iframe
                  src={previewUrl}
                  title={selected.document.originalName}
                  className="h-[70vh] w-full rounded-lg bg-white"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={selected.document.originalName}
                  className="mx-auto max-h-[70vh] max-w-full rounded-lg object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
