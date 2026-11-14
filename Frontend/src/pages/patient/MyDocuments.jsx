
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  FileImage,
  File,
  Upload,
  Search,
  Trash2,
  Eye,
  FolderOpen,
  FileCheck2,
  ClipboardList,
  X,
  Plus,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const categories = [
  "All Documents",
  "Lab Reports",
  "Prescriptions",
  "Scans & Images",
  "Other",
];

const categoryOptions = [
  "Lab Reports",
  "Prescriptions",
  "Scans & Images",
  "Other",
];

export default function MyDocuments() {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Documents");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Lab Reports");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch documents belonging to the logged-in patient.
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = sessionStorage.getItem("medikioskToken");

        if (!token) {
          throw new Error("Please log in again to view your documents.");
        }

        const response = await fetch(
          `${API_URL}/api/documents/my-documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load your documents."
          );
        }

        const formattedDocuments = (result.data || []).map((doc) => ({
          id: doc._id,
          name: doc.originalName,
          type: doc.mimeType,
          size: doc.fileSize,
          category: doc.category || "Other",
          date: new Date(doc.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          source: doc.uploadSource,
        }));

        setDocuments(formattedDocuments);
        setPageError("");
      } catch (err) {
        console.error("Fetch documents error:", err);
        setPageError(err.message || "Unable to load your documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All Documents" ||
      doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const counts = {
    total: documents.length,
    reports: documents.filter((d) => d.category === "Lab Reports").length,
    prescriptions: documents.filter(
      (d) => d.category === "Prescriptions"
    ).length,
    scans: documents.filter((d) => d.category === "Scans & Images").length,
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, JPG or PNG file.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  // Manual upload will be connected to the backend in the next step.
  
const handleUpload = async (event) => {
  event.preventDefault();

  if (!selectedFile) {
    setError("Please select a document first.");
    return;
  }

  try {
    setError("");

    const token = sessionStorage.getItem("medikioskToken");

    if (!token) {
      throw new Error("Please log in again.");
    }

    const formData = new FormData();
    formData.append("medicalDocument", selectedFile);
    formData.append("category", selectedCategory);

    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Document upload failed.");
    }

    const doc = result.data;

    const newDocument = {
      id: doc._id,
      name: doc.originalName,
      type: doc.mimeType,
      size: doc.fileSize,
      category: doc.category || "Other",
      date: new Date(doc.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      source: "manual",
    };

    setDocuments((previous) => [newDocument, ...previous]);

    setSelectedFile(null);
    setError("");
    setShowUploadModal(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  } catch (err) {
    console.error("Manual upload error:", err);
    setError(err.message || "Unable to upload document.");
  }
};


  // Delete document from backend and update the page.
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this document?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setPageError("");

      const token = sessionStorage.getItem("medikioskToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete document.");
      }

      setDocuments((previous) =>
        previous.filter((doc) => doc.id !== id)
      );
    } catch (err) {
      console.error("Delete document error:", err);
      setPageError(err.message || "Unable to delete this document.");
    } finally {
      setDeletingId(null);
    }
  };

  // Open a document using the authenticated file endpoint.
  const handleView = async (document) => {
    const newWindow = window.open("about:blank", "_blank");

    if (!newWindow) {
      setPageError("Please allow pop-ups to view your document.");
      return;
    }

    try {
      const token = sessionStorage.getItem("medikioskToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(
        `${API_URL}/api/documents/${document.id}/file`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Unable to open document.");
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      newWindow.location.href = fileUrl;

      // Release the temporary browser URL after some time.
      setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
    } catch (err) {
      console.error("View document error:", err);
      newWindow.close();
      setPageError(err.message || "Unable to open this document.");
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (type) => {
    if (type === "application/pdf") return FileText;
    if (type.startsWith("image/")) return FileImage;
    return File;
  };

  const summaryCards = [
    {
      label: "Total Documents",
      count: counts.total,
      icon: FolderOpen,
      color: "#EAF4EE",
    },
    {
      label: "Lab Reports",
      count: counts.reports,
      icon: FileCheck2,
      color: "#EAF4EE",
    },
    {
      label: "Prescriptions",
      count: counts.prescriptions,
      icon: ClipboardList,
      color: "#F5EDE8",
    },
    {
      label: "Scans & Images",
      count: counts.scans,
      icon: FileImage,
      color: "#F1F0E8",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#244C43] sm:text-3xl">
              My Documents
            </h1>
            <p className="mt-2 text-sm text-[#718078] sm:text-base">
              Keep your medical reports, prescriptions and health records
              organized in one place.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42695C]"
          >
            <Plus size={18} />
            Upload Document
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-[#E9E8DF] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#718078]">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[#244C43]">
                      {card.count}
                    </p>
                  </div>

                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: card.color }}
                  >
                    <Icon size={23} className="text-[#4F7C6D]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload information panel */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#DCEAE2] bg-[#EAF4EE] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
              <Upload size={23} className="text-[#4F7C6D]" />
            </div>

            <div>
              <h2 className="font-semibold text-[#244C43]">
                Your health records, all together
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#718078]">
                Documents uploaded during consultations are automatically
                saved here. You can view and manage them from this page.
              </p>
              <p className="mt-2 text-xs text-[#718078]">
                Supported formats: PDF, JPG, PNG · Maximum size: 10 MB
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="shrink-0 rounded-xl border border-[#4F7C6D] px-4 py-2.5 text-sm font-semibold text-[#4F7C6D] transition hover:bg-white"
          >
            Upload a file
          </button>
        </div>

        {/* API error */}
        {pageError && (
          <div className="rounded-xl border border-[#F0DDD6] bg-[#F9EEEA] p-4 text-sm text-[#A45F4D]">
            {pageError}
          </div>
        )}

        {/* Document list */}
        <section className="rounded-2xl border border-[#E9E8DF] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#244C43]">
                Your Documents
              </h2>
              <p className="mt-1 text-sm text-[#718078]">
                View and manage your uploaded medical records.
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718078]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents..."
                className="w-full rounded-xl border border-[#E9E8DF] bg-[#FFFDF8] py-2.5 pl-10 pr-4 text-sm text-[#36584E] outline-none transition focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-[#4F7C6D] text-white"
                    : "border border-[#E9E8DF] bg-[#FFFDF8] text-[#718078] hover:bg-[#EAF4EE]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Documents */}
          <div className="mt-5">
            {loading ? (
              <div className="py-14 text-center text-sm text-[#718078]">
                Loading your medical documents...
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E4DC] bg-[#FFFDF8] px-5 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4EE]">
                  <FolderOpen size={30} className="text-[#6FAF9B]" />
                </div>

                <h3 className="mt-5 font-semibold text-[#244C43]">
                  {search
                    ? "No matching documents found"
                    : "No documents uploaded yet"}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#718078]">
                  {search
                    ? "Try a different search term or category."
                    : "Documents uploaded during your consultations will appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((document) => {
                  const Icon = getFileIcon(document.type);

                  return (
                    <div
                      key={document.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-[#E9E8DF] bg-[#FFFDF8] p-4 transition hover:border-[#CFEAE3] sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF4EE]">
                          <Icon size={23} className="text-[#4F7C6D]" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#244C43]">
                            {document.name}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#718078]">
                            <span>{document.category}</span>
                            <span>•</span>
                            <span>{formatFileSize(document.size)}</span>
                            <span>•</span>
                            <span>{document.date}</span>
                            {document.source === "consultation" && (
                              <>
                                <span>•</span>
                                <span>Consultation upload</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => handleView(document)}
                          title="View document"
                          className="flex items-center gap-2 rounded-lg border border-[#DCEAE2] px-3 py-2 text-sm font-medium text-[#4F7C6D] transition hover:bg-[#EAF4EE]"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>

                        <button
                          onClick={() => handleDelete(document.id)}
                          disabled={deletingId === document.id}
                          title="Delete document"
                          className="rounded-lg border border-[#F0DDD6] p-2 text-[#B87560] transition hover:bg-[#F9EEEA] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Privacy notice */}
        <div className="flex items-start gap-3 rounded-xl border border-[#E9E8DF] bg-[#F8F7F0] p-4">
          <FileCheck2 size={20} className="mt-0.5 shrink-0 text-[#4F7C6D]" />
          <div>
            <p className="text-sm font-semibold text-[#36584E]">
              Your medical records
            </p>
            <p className="mt-1 text-xs leading-5 text-[#718078]">
              Documents are stored on the application server and associated
              with your account. Access to these documents requires
              authentication.
            </p>
          </div>
        </div>
      </div>

      {/* Manual upload modal - backend integration is the next step */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C302A]/40 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[#E9E8DF] bg-[#FFFDF8] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#244C43]">
                  Upload Document
                </h2>
                <p className="mt-1 text-sm text-[#718078]">
                  Add a medical document to your records.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-[#718078] transition hover:bg-[#EAF4EE]"
                aria-label="Close upload dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  Document Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E9E8DF] bg-white px-4 py-3 text-sm text-[#36584E] outline-none focus:border-[#6FAF9B]"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  Choose File
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border-2 border-dashed border-[#CFEAE3] bg-[#EAF4EE]/50 p-7 text-center transition hover:bg-[#EAF4EE]"
                >
                  <Upload size={27} className="mx-auto text-[#4F7C6D]" />

                  <p className="mt-3 text-sm font-semibold text-[#36584E]">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to choose a document"}
                  </p>

                  <p className="mt-1 text-xs text-[#718078]">
                    PDF, JPG or PNG · Maximum 10 MB
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {selectedFile && (
                  <p className="mt-2 text-xs text-[#4F7C6D]">
                    Selected: {formatFileSize(selectedFile.size)}
                  </p>
                )}

                {error && (
                  <p className="mt-2 text-sm text-[#B87560]">
                    {error}
                  </p>
                )}
              </div>

              

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#E9E8DF] px-5 py-2.5 text-sm font-semibold text-[#718078] transition hover:bg-[#F5F6F0]"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={!selectedFile}d
                  className="flex cursor-not-allowed items-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-2.5 text-sm font-semibold text-white opacity-50"
                >
                  <Upload size={16} />
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
