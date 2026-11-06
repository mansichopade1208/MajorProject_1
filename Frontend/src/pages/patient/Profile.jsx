
import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  Droplets,
  Pencil,
  X,
  Save,
  ShieldCheck,
} from "lucide-react";

import {
  getLoggedInUser,
  getUserInitials,
} from "../../utils/userSession";

export default function Profile() {
  const user = getLoggedInUser();

  const initialData = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    city: "",
    address: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
    setMessage("");
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    setIsEditing(false);
    setMessage(
      "Preview updated. Changes are not saved permanently yet."
    );
  };

  const initials = getUserInitials(formData.fullName || "Patient");

  const inputClass =
    "w-full rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none transition-all focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3] disabled:cursor-not-allowed disabled:bg-[#F5F6F0] disabled:text-[#718078]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#36584E]";

  const iconClass =
    "absolute left-4 top-1/2 -translate-y-1/2 text-[#6FAF9B]";

  return (
    <div className="min-h-full space-y-6 bg-[#FFFDF8] pb-8">

      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-[#244C43]">
          My Profile
        </h1>
        <p className="mt-2 text-sm text-[#718078]">
          Your personal information and account details.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="overflow-hidden rounded-2xl border border-[#E3EAE3] bg-gradient-to-r from-[#EAF4EE] to-[#CFEAE3] p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* Avatar */}
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#6FAF9B] text-3xl font-bold text-white shadow-sm">
            {initials || <UserRound size={32} />}
          </div>

          {/* User Details */}
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-[#244C43]">
              {formData.fullName || "Patient"}
            </h2>

            <p className="mt-1 text-sm text-[#527267]">
              {formData.email || "Email not provided"}
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#C4DFD2] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#4F7C6D]">
              <ShieldCheck size={15} />
              Patient Account
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setMessage("");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42695C]"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="rounded-2xl border border-[#E9E8DF] bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CFEAE3] text-[#4F7C6D]">
            <UserRound size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#244C43]">
              Personal Information
            </h2>
            <p className="text-sm text-[#87918A]">
              Manage your personal and contact details.
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-5 rounded-xl border border-[#E8CFC3] bg-[#F8EDE7] px-4 py-3 text-sm text-[#A36E5C]">
            {message}
          </div>
        )}

        {isEditing && (
          <div className="mb-5 rounded-xl border border-[#CFEAE3] bg-[#F0F7F2] px-4 py-3 text-sm text-[#4F7C6D]">
            Update your details below. Changes are currently preview-only
            and will not persist after refreshing.
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <UserRound className={iconClass} size={18} />
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail className={iconClass} size={18} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className={`${inputClass} pl-11`}
                  placeholder="Your registered email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <Phone className={iconClass} size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className={labelClass}>Date of Birth</label>
              <div className="relative">
                <CalendarDays className={iconClass} size={18} />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClass}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className={labelClass}>Blood Group</label>
              <div className="relative">
                <Droplets
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C58F7B]"
                  size={18}
                />
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-11`}
                >
                  <option value="">Select blood group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* City */}
            <div>
              <label className={labelClass}>City</label>
              <div className="relative">
                <MapPin className={iconClass} size={18} />
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`${inputClass} pl-11`}
                  placeholder="Enter your city"
                />
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className={labelClass}>Residential Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-[#6FAF9B]" size={18} />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`${inputClass} resize-none pl-11`}
                  placeholder="Enter your complete address"
                />
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-[#EDF0E9] pt-6 sm:flex-row">

              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#DCE5DD] bg-white px-6 py-3 text-sm font-semibold text-[#52665D] transition hover:bg-[#F5F8F5]"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42695C]"
              >
                <Save size={16} />
                Preview Changes
              </button>

            </div>
          )}
        </form>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-4 rounded-2xl border border-[#DCE9DF] bg-[#EAF4EE] p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#4F7C6D] text-white">
          <ShieldCheck size={23} />
        </div>

        <div>
          <h3 className="font-semibold text-[#31594E]">
            Your information matters
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[#61796D]">
            Your personal and medical information should only be
            accessible to authorized healthcare professionals.
          </p>
        </div>
      </div>

    </div>
  );
}
