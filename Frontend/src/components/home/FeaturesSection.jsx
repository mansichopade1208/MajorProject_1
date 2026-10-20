
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
      "Your information is protected with industry-standard security.",
    Icon: ShieldCheck,
  },
  {
    title: "Save Time",
    description:
      "Provide your medical history before your consultation.",
    Icon: Clock,
  },
  {
    title: "Smarter Insights",
    description:
      "AI organizes your information into a clear case summary.",
    Icon: Brain,
    tone: "peach",
  },
  {
    title: "Better Care",
    description:
      "Help your doctor understand you better, faster.",
    Icon: Heart,
  },
];

export default function FeaturesSection() {
  return (
    <section
      aria-label="MediKiosk benefits"
      className="mx-[3%] mt-5 grid grid-cols-1 gap-8 rounded-2xl bg-[#EEF3ED] px-7 py-9 sm:grid-cols-2 sm:gap-x-10 sm:px-10 lg:grid-cols-4 lg:gap-8 lg:px-[3%] lg:py-9"
    >
      {features.map((feature) => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </section>
  );
}
