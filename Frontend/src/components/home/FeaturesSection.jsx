
import {
  ShieldCheck,
  Clock,
  Brain,
  Heart,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Secure & Private",
    description:
      "Keep your medical information protected with privacy-focused design.",
    Icon: ShieldCheck,
  },
  {
    title: "Save Time",
    description:
      "Share your medical history before your appointment and prepare ahead.",
    Icon: Clock,
  },
  {
    title: "Smarter Insights",
    description:
      "Help organize patient information into a clear case summary.",
    Icon: Brain,
    tone: "peach",
  },
  {
    title: "Better Care",
    description:
      "Help doctors understand your health concerns more easily.",
    Icon: Heart,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="benefits"
      aria-label="MediKiosk benefits"
      className="relative overflow-hidden bg-white px-6 py-20 sm:px-10 sm:py-24 lg:px-[7%]"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[3px] text-[#6C9C8C]">
            Why MediKiosk?
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-[#214A43] sm:text-4xl lg:text-5xl">
            Healthcare that puts
            <span className="block mt-2 text-[#6C9C8C]">
              you first.
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-[#627C74] sm:text-lg">
            A better patient experience through simple,
            thoughtful tools that help you prepare for your visit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
