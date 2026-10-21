
import { Link } from "react-router-dom";
import {
  UserRound,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Sparkles,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#FAF8F2]"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#DDEAE1] opacity-60 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-14 sm:px-10 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-[7%] lg:py-24">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D5E5DA] bg-white px-4 py-2 text-sm font-semibold text-[#47796F] shadow-sm">
            <Sparkles size={16} />
            Smarter Healthcare Starts Here
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.13] tracking-tight text-[#214A43] sm:text-5xl lg:text-6xl xl:text-[68px]">
            Your health journey
            <span className="mt-2 block text-[#6C9C8C]">
              starts here.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#627C74] sm:text-lg">
            A simpler way to prepare for your doctor visit.
            Share your symptoms, medical history, and reports
            before your consultation for more informed care.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/patient/register"
              className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-xl bg-[#47796F] px-7 py-4 font-semibold text-white shadow-lg shadow-[#47796F]/20 transition duration-300 hover:-translate-y-1 hover:bg-[#315E54] hover:shadow-xl"
            >
              <UserRound size={21} />
              Get Started
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#benefits"
              className="inline-flex min-h-[58px] items-center justify-center rounded-xl border border-[#D8E4DB] bg-white px-7 py-4 font-semibold text-[#315E54] transition hover:border-[#47796F] hover:bg-[#F0F5F0]"
            >
              Explore Benefits
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-[#E4E8DF] pt-7">
            <div className="flex items-center gap-2 text-sm text-[#52746D]">
              <ShieldCheck size={21} className="text-[#47796F]" />
              Privacy focused
            </div>

            <div className="flex items-center gap-2 text-sm text-[#52746D]">
              <HeartPulse size={21} className="text-[#47796F]" />
              Patient focused
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
          <div className="absolute -inset-4 rounded-[40px] bg-[#DDE9DE] sm:-inset-6" />

          <div className="relative overflow-hidden rounded-[32px] border border-white bg-[#E7ECE4] shadow-2xl shadow-[#214A43]/10">
            <img
              src="/homeImgMain.png"
              alt="Patient in a welcoming healthcare environment"
              className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[500px]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#173D35]/80 via-[#173D35]/20 to-transparent p-6 pt-20 sm:p-8 sm:pt-24">
              <p className="text-xl font-semibold text-white sm:text-2xl">
                Better preparation. Better conversations.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/85 sm:text-base">
                Make every consultation more meaningful.
              </p>
            </div>
          </div>

          <div className="absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-white bg-white/95 p-3 shadow-xl sm:-left-8 sm:p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E1EEE5] text-[#47796F]">
              <ShieldCheck size={24} />
            </span>
            <div>
              <p className="text-sm font-bold text-[#214A43]">
                Your Health Matters
              </p>
              <p className="mt-1 text-xs text-[#668078]">
                Care starts with you
              </p>
            </div>
          </div>

          <div className="absolute -bottom-5 right-3 rounded-2xl border border-white bg-white p-4 shadow-xl sm:-right-5 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5E5D8] text-[#A56846]">
                <HeartPulse size={22} />
              </span>
              <div>
                <p className="text-sm font-bold text-[#214A43]">
                  Care made simpler
                </p>
                <p className="mt-1 text-xs text-[#668078]">
                  Patient-first experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
