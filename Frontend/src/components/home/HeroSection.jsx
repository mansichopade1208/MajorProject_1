
import { Link } from "react-router-dom";
import {
  UserRound,
  Stethoscope,
  ArrowRight,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="grid overflow-hidden lg:min-h-[588px] lg:grid-cols-2"
    >
      <div className="flex items-center px-6 py-12 sm:px-[6%] lg:py-14">
        <div className="w-full">
          <p className="mb-5 text-xs font-bold tracking-[3px] text-[#7CA49A] sm:text-base">
            SMART PATIENT INTAKE
          </p>

          <h1 className="font-serif text-[42px] font-semibold leading-[1.12] tracking-[-1.5px] text-[#214A43] sm:text-5xl md:text-6xl xl:text-[68px]">
            Your health journey
            <br className="hidden sm:block" />
            {" "}starts here.
          </h1>

          <p className="mt-6 max-w-[490px] text-base leading-[1.8] text-[#50766F] sm:text-lg">
            Share your symptoms, medical history and reports
            before your consultation, so your doctor can better
            understand your needs.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <Link
              to="/patient/register"
              className="flex min-h-[66px] items-center justify-center gap-3 rounded-xl border border-[#47796F] bg-[#47796F] px-5 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#38665C] sm:min-h-[73px] sm:px-6 sm:text-lg"
            >
              <UserRound size={32} strokeWidth={1.8} />
              <span>Register</span>
              <ArrowRight size={19} />
            </Link>

          </div>
        </div>
      </div>

      <div className="relative min-h-[330px] overflow-hidden bg-[#E7ECE4] lg:min-h-0 lg:rounded-tl-[150px]">
        <img
          src="/homeImgMain.png"
          alt="Patient in a welcoming healthcare environment"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </div>
    </section>
  );
}
