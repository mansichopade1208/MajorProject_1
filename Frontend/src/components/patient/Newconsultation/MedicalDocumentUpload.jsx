
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  FileImage,
  X,
  FileCheck2,
  AlertCircle,
  Eye,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

function getFileExtension(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

function isPdf(file) {
  return getFileExtension(file.name) === "pdf";
}

function isImage(file) {
  return ["jpg", "jpeg", "png"].includes(
    getFileExtension(file.name)
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MedicalDocumentUpload({
  files = [],
  onFilesChange,
}) {
  const inputRef = useRef(null);

  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Create and clean up the preview URL when the selected file changes.
  useEffect(() => {
    if (!previewFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(previewFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [previewFile]);

  function addFiles(selectedFiles) {
    setError("");

    const incomingFiles = Array.from(selectedFiles || []);
    const validFiles = [];
    const errors = [];

    for (const file of incomingFiles) {
      const extension = getFileExtension(file.name);

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        errors.push(
          `${file.name}: Only PDF, JPG and PNG files are allowed.`
        );
        continue;
      }

      if (file.size === 0) {
        errors.push(`${file.name}: This file is empty.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(
          `${file.name}: File size must be 10 MB or smaller.`
        );
        continue;
      }

      validFiles.push(file);
    }

    // Avoid adding the same file more than once.
    const uniqueFiles = validFiles.filter(
      (file) =>
        !files.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        )
    );

    // Keep the frontend limit consistent with the current backend.
    const remainingSlots = MAX_FILES - files.length;
    const filesToAdd = uniqueFiles.slice(
      0,
      Math.max(0, remainingSlots)
    );

    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd]);
    }

    if (uniqueFiles.length > filesToAdd.length) {
      errors.push(
        `You can upload a maximum of ${MAX_FILES} documents.`
      );
    }

    if (uniqueFiles.length < validFiles.length) {
      errors.push("Duplicate files were skipped.");
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
    }

    // Allows the same file to be selected again after removal.
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeFile(indexToRemove) {
    onFilesChange(
      files.filter((_, index) => index !== indexToRemove)
    );

    if (
      previewFile &&
      files[indexToRemove] === previewFile
    ) {
      setPreviewFile(null);
    }

    setError("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function openPreview(file) {
    setPreviewFile(file);
  }

  return (
    <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5 sm:p-6">

      {/* Section heading */}
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

      {/* Drag and drop area */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
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
          Drag and drop your documents here
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Or select files from your device
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= MAX_FILES}
          className="mt-4 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285C50] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Choose documents
        </button>

        <p className="mt-3 text-xs text-gray-400">
          PDF, JPG, PNG · Maximum 10 MB per file · Up to 5 files
        </p>
      </div>

      {/* Validation errors */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
          <p>{error}</p>
        </div>
      )}

      {/* Selected documents */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-[#214D43]">
            Selected documents
          </h3>

          <span className="rounded-full bg-[#E0EEE7] px-3 py-1 text-xs font-medium text-[#315F53]">
            {files.length}/{MAX_FILES} files
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
                  {isImage(file) ? (
                    <FileImage size={21} />
                  ) : (
                    <FileCheck2 size={21} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-[#214D43]">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {isPdf(file) ? "PDF" : "Image"} ·{" "}
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Preview */}
                <button
                  type="button"
                  onClick={() => openPreview(file)}
                  aria-label={`Preview ${file.name}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#EAF3ED] hover:text-[#326F61]"
                >
                  <Eye size={18} />
                </button>

                {/* Remove */}
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

      {/* Document preview modal */}
      {previewFile && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-4">
              <p className="min-w-0 truncate text-sm font-semibold text-[#214D43]">
                {previewFile.name}
              </p>

              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                aria-label="Close preview"
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {isImage(previewFile) ? (
              <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-100 p-3">
                <img
                  src={previewUrl}
                  alt={`Preview of ${previewFile.name}`}
                  className="max-h-[75vh] max-w-full object-contain"
                />
              </div>
            ) : (
              <iframe
                src={previewUrl}
                title={`Preview of ${previewFile.name}`}
                className="h-[75vh] w-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
