
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Plus,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[#DCE5DC] bg-white px-4 py-3.5 text-sm text-[#214A43] outline-none transition placeholder:text-[#9AAEA5] focus:border-[#47796F] focus:ring-4 focus:ring-[#47796F]/10";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Invalid email or password."
        );
      }

      // The role comes from the backend/database.
      const user = result.user;

      if (!user || !user.role) {
        throw new Error("Unable to identify your account role.");
      }

      // Store basic user details for this browser session.
      sessionStorage.setItem(
        "medikioskUser",
        JSON.stringify(user)
      );

      // Redirect automatically according to the registered role.
      if (user.role === "patient") {
        navigate("/patient/dashboard", { replace: true });
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard", { replace: true });
      } else {
        sessionStorage.removeItem("medikioskUser");
        throw new Error("Invalid account role.");
      }
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? "Cannot connect to the server. Please check your backend."
          : error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[80vh] overflow-hidden bg-[#F8F7F1] px-4 py-8 sm:px-6 sm:py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#DDEAE1]/70 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#F2E2D6]/60 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
       

        <div className="grid overflow-hidden rounded-3xl border border-[#E3E9E0] bg-white shadow-xl shadow-[#214A43]/5 lg:grid-cols-2">
          {/* Welcome panel */}
          <aside className="relative overflow-hidden bg-[#214A43] p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full border border-white/10" />

            <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full border border-white/10" />

            <div className="relative">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <HeartPulse size={32} />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#B8D8C5]">
                Welcome back
              </p>

              <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Your health, your journey.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/75 sm:text-base">
                Your healthcare journey starts here. Sign in
                to access your personalized MediKiosk experience,
                whether you are a patient or a healthcare professional.
              </p>

              {/* Benefits */}
              <div className="mt-9 space-y-4">
                {[
                  "Simple and easy to use",
                  "Your healthcare information in one place",
                  "A smoother consultation experience",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-[#B8D8C5]"
                    />

                    <span className="text-sm text-white/90">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Security information */}
              <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                <ShieldCheck
                  size={27}
                  className="shrink-0 text-[#B8D8C5]"
                />

                <div>
                  <p className="font-semibold">
                    Your care matters
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/70">
                    Sign in with the email and password
                    linked to your registered account.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Common login form */}
          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#7CA49A]">
                Your account
              </p>

              <h2 className="text-3xl font-bold text-[#214A43]">
                Sign in
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#789087]">
                Welcome back! Enter your details to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#315E54]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#315E54]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#789087] hover:text-[#214A43]"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {message && (
                <div
                  role="alert"
                  className="rounded-xl bg-[#FBE9E5] p-3 text-sm leading-6 text-[#9D4337]"
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#47796F] px-6 py-4 font-semibold text-white shadow-lg shadow-[#47796F]/20 transition hover:-translate-y-0.5 hover:bg-[#315E54] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}

                {!loading && (
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Signup link */}
              <p className="pt-2 text-center text-sm text-[#789087]">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-[#47796F] hover:text-[#214A43]"
                >
                  Create account
                </Link>
              </p>
            </form>
          </section>
        </div>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-[#8AA097]">
          © {new Date().getFullYear()} MediKiosk · Your health, our priority.
        </p>
      </div>
    </main>
  );
}
