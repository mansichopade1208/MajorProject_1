import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import {
  UserRound,
  Stethoscope,
  ShieldCheck,
  Eye,
  EyeOff,
  HeartPulse,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#DCE5DC] bg-white px-4 py-3 text-sm text-[#214A43] outline-none transition placeholder:text-[#9AAEA5] focus:border-[#47796F] focus:ring-4 focus:ring-[#47796F]/10";

const labelClass = "mb-2 block text-sm font-semibold text-[#315E54]";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  autoComplete,
  children,
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-[#A45D36]">*</span>}
      </label>

      {children || (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={inputClass}
        />
      )}
    </div>
  );
}

export default function Signup() {
    const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    if (data.get("password") !== data.get("confirmPassword")) {
      setMessage("Your passwords do not match.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: data.get("fullName"),
        email: data.get("email"),
        phone: data.get("phone"),
        password: data.get("password"),
        role,
      };

      if (role === "patient") {
        payload.dateOfBirth = data.get("dateOfBirth");
        payload.gender = data.get("gender");
        payload.bloodGroup = data.get("bloodGroup");
        payload.city = data.get("city");
        payload.address = data.get("address");
      } else {
        payload.medicalRegistrationNumber = data.get("registrationNumber");
        payload.specialization = data.get("specialization");
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Registration failed. Please try again."
        );
      }

     form.reset();

if (role === "patient") {
  navigate("/patient/dashboard");
} else {
  navigate("/doctor/dashboard");
}
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      if (
        error instanceof TypeError ||
        error.message === "Failed to fetch"
      ) {
        setMessage(
          "Cannot connect to the backend. Make sure the backend server is running at http://localhost:5000."
        );
      } else {
        setMessage(
          error.message || "Something went wrong. Please try again."
        );
      }

      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isPatient = role === "patient";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F7F1] px-4 py-10 sm:px-6 sm:py-14">
      {/* Soft background decorations */}
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-[#DDEAE1]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#F2E2D6]/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Page heading */}
        <div className="mb-9 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#214A43] sm:text-4xl lg:text-5xl">
            Create your account
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#627C74] sm:text-base">
            A simpler way to connect patients and healthcare professionals.
            Choose your account type to get started.
          </p>
        </div>

        {/* Main card */}
        <div className="grid overflow-hidden rounded-3xl border border-[#E3E9E0] bg-white shadow-xl shadow-[#214A43]/5 lg:grid-cols-[0.78fr_1.22fr]">
          {/* Left information panel */}
          <aside className="relative overflow-hidden bg-[#214A43] p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />

            <div className="relative">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                {isPatient ? (
                  <HeartPulse size={30} />
                ) : (
                  <Stethoscope size={30} />
                )}
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#B8D8C5]">
                {isPatient ? "For patients" : "For doctors"}
              </p>

              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                {isPatient
                  ? "Your health, your journey."
                  : "Care starts with connection."}
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
                {isPatient
                  ? "Prepare for consultations by sharing your details and health concerns in one convenient place."
                  : "Create your professional profile to help patients prepare for consultations."}
              </p>

              <div className="mt-9 space-y-4">
                {(isPatient
                  ? [
                      "Keep your basic details organized",
                      "Share health information when needed",
                      "Prepare for your consultations",
                    ]
                  : [
                      "Create your professional profile",
                      "Provide your credentials and specialization",
                      "Help patients prepare for their visits",
                    ]
                ).map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-[#B8D8C5]"
                    />
                    <p className="text-sm leading-6 text-white/90">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={23}
                    className="mt-0.5 shrink-0 text-[#B8D8C5]"
                  />

                  <div>
                    <p className="font-semibold">Your information matters</p>
                    <p className="mt-1 text-xs leading-5 text-white/70">
                      Only provide information you are comfortable sharing.
                      Sensitive health details should be handled securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Right registration form */}
          <section className="p-5 sm:p-9 lg:p-12">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-[#214A43]">Sign up</h2>
              <p className="mt-2 text-sm text-[#789087]">
                Select the account type that describes you.
              </p>
            </div>

            {/* Account type selector */}
            <div className="mb-8 grid grid-cols-2 gap-3 rounded-2xl bg-[#F4F7F2] p-2">
              <button
                type="button"
                onClick={() => {
                  setRole("patient");
                  setMessage("");
                }}
                aria-pressed={isPatient}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-4 text-sm font-semibold transition-all ${
                  isPatient
                    ? "bg-[#47796F] text-white shadow-md"
                    : "text-[#52746D] hover:bg-white"
                }`}
              >
                <UserRound size={19} />
                Patient
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("doctor");
                  setMessage("");
                }}
                aria-pressed={!isPatient}
                className={`flex items-center justify-center gap-2 rounded-xl px-3 py-4 text-sm font-semibold transition-all ${
                  !isPatient
                    ? "bg-[#47796F] text-white shadow-md"
                    : "text-[#52746D] hover:bg-white"
                }`}
              >
                <Stethoscope size={19} />
                Doctor
              </button>
            </div>

            {/* Registration form */}
            <form
              key={role}
              onSubmit={handleSubmit}
              className="space-y-7"
            >
              {/* Basic details */}
              <div>
                <h3 className="mb-4 text-base font-bold text-[#214A43]">
                  {isPatient
                    ? "Personal information"
                    : "Personal & professional information"}
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Full name"
                    name="fullName"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />

                  <Field
                    label="Phone number"
                    name="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    autoComplete="tel"
                    required
                  />

                  {isPatient ? (
                    <Field
                      label="Date of birth"
                      name="dateOfBirth"
                      type="date"
                      required
                    />
                  ) : (
                    <Field
                      label="Medical registration number"
                      name="registrationNumber"
                      placeholder="Enter registration number"
                      required
                    />
                  )}

                  {isPatient ? (
                    <Field label="Gender" name="gender" required>
                      <select
                        id="gender"
                        name="gender"
                        className={inputClass}
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </Field>
                  ) : (
                    <Field
                      label="Specialization"
                      name="specialization"
                      required
                    >
                      <select
                        id="specialization"
                        name="specialization"
                        className={inputClass}
                        defaultValue=""
                        required
                      >
                        <option value="" disabled>
                          Select specialization
                        </option>
                        <option value="general-physician">
                          General Physician
                        </option>
                        <option value="cardiology">Cardiology</option>
                        <option value="dermatology">Dermatology</option>
                        <option value="pediatrics">Pediatrics</option>
                        <option value="gynecology">Gynecology</option>
                        <option value="orthopedics">Orthopedics</option>
                        <option value="neurology">Neurology</option>
                        <option value="psychiatry">Psychiatry</option>
                        <option value="dentistry">Dentistry</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                  )}
                </div>
              </div>

              {/* Patient-only details */}
              {isPatient && (
                <div className="border-t border-[#E8EDE7] pt-6">
                  <h3 className="mb-2 text-base font-bold text-[#214A43]">
                    Health profile
                  </h3>

                  <p className="mb-4 text-xs leading-5 text-[#789087]">
                    Optional. You can also provide these details later as part
                    of your patient intake.
                  </p>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <Field label="Blood group" name="bloodGroup">
                      <select
                        id="bloodGroup"
                        name="bloodGroup"
                        className={inputClass}
                        defaultValue=""
                      >
                        <option value="">Select if known</option>
                        {[
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "O+",
                          "O-",
                        ].map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                        <option value="unknown">Don't know</option>
                      </select>
                    </Field>

                    <Field
                      label="City"
                      name="city"
                      placeholder="Your city"
                      autoComplete="address-level2"
                    />

                    <div className="sm:col-span-2">
                      <Field
                        label="Address"
                        name="address"
                        placeholder="House, street and area"
                        autoComplete="street-address"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password section */}
              <div className="border-t border-[#E8EDE7] pt-6">
                <h3 className="mb-4 text-base font-bold text-[#214A43]">
                  Secure your account
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    required
                  >
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        required
                        className={`${inputClass} pr-12`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#789087] hover:text-[#214A43]"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Field
                    label="Confirm password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter password again"
                    autoComplete="new-password"
                    required
                  >
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        minLength={8}
                        autoComplete="new-password"
                        placeholder="Enter password again"
                        required
                        className={`${inputClass} pr-12`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#789087] hover:text-[#214A43]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </Field>
                </div>
              </div>

              {/* Feedback */}
              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl p-4 text-sm leading-6 ${
                    messageType === "success"
                      ? "bg-[#E6F3E9] text-[#245E43]"
                      : "bg-[#FBE9E5] text-[#9D4337]"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#47796F] px-6 py-4 font-semibold text-white shadow-lg shadow-[#47796F]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#315E54] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Creating account..."
                  : `Create ${isPatient ? "Patient" : "Doctor"} Account`}

                <ArrowRight
                  size={19}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <p className="text-center text-sm text-[#789087]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#47796F] hover:text-[#214A43]"
                >
                  Log in
                </Link>
              </p>
            </form>
          </section>
        </div>

        <p className="mt-7 text-center text-xs text-[#8AA097]">
          © {new Date().getFullYear()} MediKiosk · Patient-first healthcare
        </p>
      </div>
    </main>
  );
}
