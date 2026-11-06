
import { useState } from "react";
import {
  Activity,
  Pill,
  AlertTriangle,
  Scissors,
  Plus,
  X,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Trash2,
} from "lucide-react";

const initialRecords = {
  conditions: [],
  medications: [],
  allergies: [],
  surgeries: [],
};

const categories = [
  { id: "conditions", label: "Conditions", icon: Activity },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "allergies", label: "Allergies", icon: AlertTriangle },
  { id: "surgeries", label: "Surgeries", icon: Scissors },
];

const emptyForm = {
  title: "",
  details: "",
  date: "",
};

export default function MedicalHistory() {
  const [records, setRecords] = useState(initialRecords);
  const [activeCategory, setActiveCategory] = useState("conditions");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const totalRecords = Object.values(records).reduce(
    (total, items) => total + items.length,
    0
  );

  const handleAddRecord = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    setRecords((prev) => ({
      ...prev,
      [activeCategory]: [
        ...prev[activeCategory],
        {
          id: Date.now(),
          ...formData,
        },
      ],
    }));

    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (category, id) => {
    setRecords((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const activeInfo = categories.find(
    (category) => category.id === activeCategory
  );

  const ActiveIcon = activeInfo.icon;

  return (
    <div className="min-h-full space-y-6 bg-[#FFFDF8] pb-8">

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#244C43]">
            Medical History
          </h1>
          <p className="mt-2 text-sm text-[#718078]">
            Keep track of your health conditions, medications and medical records.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42695C]"
        >
          <Plus size={18} />
          Add Medical Record
        </button>
      </div>

      {/* Overview Banner */}
      <div className="rounded-2xl border border-[#DCE9DF] bg-gradient-to-r from-[#EAF4EE] to-[#CFEAE3] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4F7C6D] text-white">
            <HeartPulse size={28} />
          </div>

          <div>
            <p className="text-sm font-medium text-[#527267]">
              Your Medical Records
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#244C43]">
              {totalRecords} Records Added
            </h2>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                isActive
                  ? "border-[#6FAF9B] bg-[#EAF4EE] shadow-sm"
                  : "border-[#E9E8DF] bg-white hover:border-[#CFEAE3]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CFEAE3] text-[#4F7C6D]">
                  <Icon size={21} />
                </div>

                <span className="text-2xl font-bold text-[#244C43]">
                  {records[category.id].length}
                </span>
              </div>

              <h3 className="mt-4 font-semibold text-[#31594E]">
                {category.label}
              </h3>
              <p className="mt-1 text-xs text-[#87918A]">
                View your {category.label.toLowerCase()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Records Section */}
      <div className="rounded-2xl border border-[#E9E8DF] bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CFEAE3] text-[#4F7C6D]">
              <ActiveIcon size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#244C43]">
                {activeInfo.label}
              </h2>
              <p className="text-sm text-[#87918A]">
                {records[activeCategory].length} records
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#CFEAE3] bg-[#F0F7F2] px-4 py-2.5 text-sm font-semibold text-[#4F7C6D] transition hover:bg-[#EAF4EE]"
          >
            <Plus size={16} />
            Add {activeInfo.label}
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {records[activeCategory].length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCE5DD] bg-[#FFFDF8] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4EE] text-[#6FAF9B]">
                <ClipboardList size={27} />
              </div>

              <h3 className="mt-4 font-semibold text-[#31594E]">
                No {activeInfo.label.toLowerCase()} added yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-[#87918A]">
                Add your medical information to maintain a complete health history.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#42695C]"
              >
                <Plus size={16} />
                Add Record
              </button>
            </div>
          ) : (
            records[activeCategory].map((record) => (
              <div
                key={record.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#E9E8DF] bg-[#FFFDF8] p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-[#31594E]">
                    {record.title}
                  </h3>

                  {record.details && (
                    <p className="mt-1 text-sm text-[#718078]">
                      {record.details}
                    </p>
                  )}

                  {record.date && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-[#87918A]">
                      <CalendarDays size={14} />
                      {record.date}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    handleDelete(activeCategory, record.id)
                  }
                  className="flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm text-[#B47765] transition hover:bg-[#F8EDE7] sm:self-center"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Record Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#244C43]/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#244C43]">
                  Add Medical Record
                </h2>
                <p className="mt-1 text-sm text-[#87918A]">
                  Enter your medical information below.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData(emptyForm);
                }}
                className="rounded-lg p-2 text-[#718078] hover:bg-[#F5F6F0]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  Record Category
                </label>

                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  {activeCategory === "conditions"
                    ? "Condition Name"
                    : activeCategory === "medications"
                    ? "Medicine Name"
                    : activeCategory === "allergies"
                    ? "Allergy Name"
                    : "Surgery Name"}
                </label>

                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter name"
                  className="w-full rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  Additional Details
                </label>

                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: e.target.value,
                    })
                  }
                  placeholder="Add dosage, severity, notes or other details..."
                  className="w-full resize-none rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  Date
                </label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData(emptyForm);
                  }}
                  className="rounded-xl border border-[#DCE5DD] px-5 py-3 text-sm font-semibold text-[#52665D] hover:bg-[#F5F8F5]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#42695C]"
                >
                  <Plus size={17} />
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
