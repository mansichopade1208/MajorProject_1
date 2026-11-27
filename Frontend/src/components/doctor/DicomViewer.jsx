import { useState } from "react";
import { FileImage, FileArchive, ScanEye } from "lucide-react";
import DicomViewerModal from "./DicomViewerModal.jsx";

const DICOM_TYPES = ["application/dicom"];
const ZIP_TYPES = ["application/zip", "application/x-zip-compressed"];

export default function DicomViewer({ documents = [], reportId, accessToken }) {
  const [open, setOpen] = useState(false);

  const dicomDocuments = documents.filter(
    (document) =>
      DICOM_TYPES.includes(document.mimeType) ||
      ZIP_TYPES.includes(document.mimeType) ||
      /\.(dcm|zip)$/i.test(document.originalName || "")
  );

  const otherDocuments = documents.filter(
    (document) => !dicomDocuments.some((item) => item._id === document._id)
  );


  return (
    <section className="rounded-2xl border border-[#E6EAE2] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-[#EDF4EF] p-2.5 text-[#47796F]">
          <ScanEye size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[#214A43]">Original Medical Documents & DICOM Scans</h3>
          <p className="mt-1 text-xs text-[#82948B]">Original uploads associated with this consultation</p>
        </div>
      </div>

      {documents.length === 0 ? (
        <p className="text-sm text-[#8A9B93]">No documents were uploaded with this consultation.</p>
      ) : (
        <div className="space-y-2">
          {documents.map((document) => {
            const isDicom = dicomDocuments.some((item) => item._id === document._id);
            return (
              <div key={document._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E6ECE5] bg-[#FAFCF9] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-lg bg-[#EAF2EC] p-2 text-[#47796F]">
                    {isDicom ? <FileArchive size={19} /> : <FileImage size={19} />}
                  </div>
                  <div className="min-w-0">
                    <p className="break-all text-sm font-semibold text-[#315E54]">{document.originalName}</p>
                    <p className="mt-1 text-xs text-[#82948B]">
                      {document.category || (isDicom ? "DICOM scan" : "Medical document")} · {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {isDicom && (
                  <span className="rounded-lg bg-[#EAF2EC] px-3 py-1.5 text-xs font-semibold text-[#47796F]">DICOM</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {dicomDocuments.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#CFE0D4] bg-[#F3F8F4] p-4">
          <div>
            <p className="text-sm font-semibold text-[#214A43]">Interactive DICOM viewer</p>
            <p className="mt-1 text-xs text-[#789087]">Open DICOM files and ZIP series in 2D / 3D viewer.</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#47796F] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#315E54]"
          >
            <ScanEye size={16} /> Open DICOM viewer
          </button>
        </div>
      )}

      {otherDocuments.length > 0 && (
        <p className="mt-3 text-xs text-[#82948B]">PDF and ordinary image files are listed above. Use the existing document access route to preview those formats.</p>
      )}

      {open && (
        <DicomViewerModal
          documents={dicomDocuments}
          reportId={reportId}
          accessToken={accessToken}
          onClose={() => setOpen(false)}
        />
      )}
    </section>
  );
}
