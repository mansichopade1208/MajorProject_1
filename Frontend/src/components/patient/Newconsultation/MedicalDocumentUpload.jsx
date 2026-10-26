
import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  X,
  FileCheck2,
  AlertCircle,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB per PDF

export default function MedicalDocumentUpload({
  files = [],
  onFilesChange,
}) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function addFiles(selectedFiles) {
    setError("");

    const incomingFiles = Array.from(selectedFiles);
    const validFiles = [];
    const errors = [];

    for (const file of incomingFiles) {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        errors.push(`${file.name}: Only PDF files are allowed.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File size must be under 10 MB.`);
        continue;
      }

      if (file.size === 0) {
        errors.push(`${file.name}: This file is empty.`);
        continue;
      }

      validFiles.push(file);
    }

    const existingFiles = files || [];
    const uniqueFiles = validFiles.filter(
      (file) =>
        !existingFiles.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        )
    );

    if (uniqueFiles.length > 0) {
      onFilesChange([...existingFiles, ...uniqueFiles]);
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
    } else if (uniqueFiles.length < validFiles.length) {
      setError("Duplicate files were skipped.");
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeFile(indexToRemove) {
    onFilesChange(
      files.filter((_, index) => index !== indexToRemove)
    );
    setError("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
          <FileText size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-[#214D43]">
            Medical documents
          </h2>
          <p className="text-sm text-gray-500">
            Upload your relevant medical reports.
          </p>
        </div>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`mt-5 rounded-xl border-2 border-dashed p-6 text-center transition sm:p-8 ${
          isDragging
            ? "border-[#47796E] bg-[#EAF3ED]"
            : "border-[#B9D5C5] bg-white"
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
          <Upload size={23} />
        </div>

        <h3 className="mt-4 font-semibold text-[#214D43]">
          Drag and drop your PDF files
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Or select files from your device
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285C50]"
        >
          Choose PDF files
        </button>

        <p className="mt-3 text-xs text-gray-400">
          PDF only · Maximum 10 MB per file · Multiple files allowed
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-[#214D43]">
            Selected documents
          </h3>

          <span className="rounded-full bg-[#E0EEE7] px-3 py-1 text-xs font-medium text-[#315F53]">
            {files.length} {files.length === 1 ? "file" : "files"}
          </span>
        </div>

        {files.length === 0 ? (
          <div className="mt-3 rounded-xl border border-[#DCE5DC] bg-white p-5 text-center">
            <FileText
              size={25}
              className="mx-auto text-[#9BAFA4]"
            />
            <p className="mt-2 text-sm text-gray-500">
              No documents selected yet.
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-[#DCE5DC] bg-white p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
                  <FileCheck2 size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-[#214D43]">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    PDF · {formatFileSize(file.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
