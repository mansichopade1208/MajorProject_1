import { useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NewConsultation() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Tell us what brings you here",
      description:
        "Describe your current symptoms in your own words. The interview interface will display follow-up questions provided by the AI service.",
    },
    {
      title: "Your medical history",
      description:
        "Add information about past illnesses, ongoing conditions, allergies and medications.",
    },
    {
      title: "Upload medical documents",
      description:
        "Select relevant prescriptions, laboratory reports or discharge summaries.",
    },
    {
      title: "Review and submit",
      description:
        "Review your answers and selected documents before submitting your information.",
    },
  ];

  const currentStep = steps[step];

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/patient/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#47796E] hover:underline"
      >
        <ArrowLeft size={17} /> Back to Dashboard
      </Link>

      <div className="rounded-2xl border border-[#E7E7DF] bg-white p-6 sm:p-9">
        <p className="text-sm font-medium text-[#47796E]">
          Step {step + 1} of {steps.length}
        </p>

        <div className="mt-3 flex gap-2">
          {steps.map((item, index) => (
            <div
              key={item.title}
              className={`h-1.5 flex-1 rounded-full ${
                index <= step ? "bg-[#47796E]" : "bg-[#E5EAE4]"
              }`}
            />
          ))}
        </div>

        <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
          <MessageCircle size={25} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#214D43]">
          {currentStep.title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {currentStep.description}
        </p>

        {step === 0 && (
          <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
            <p className="font-medium text-[#315F53]">
              Health interview
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your conversational interview UI will go here. It will render
              dynamic questions and answer options from the AI integration,
              rather than a fixed list of medical questions.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="mt-6 rounded-xl border border-dashed border-[#B9D5C5] bg-[#F8FAF6] p-8 text-center">
            <p className="font-medium text-[#315F53]">
              Document upload interface
            </p>
            <p className="mt-2 text-sm text-gray-500">
              The file picker and selected-file list will go here.
            </p>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            disabled={step === 0}
            onClick={() => setStep((current) => current - 1)}
            className="rounded-xl border border-[#DCE5DC] px-4 py-3 text-sm font-medium text-[#315F53] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep((current) => current + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50]"
            >
              Continue <ArrowRight size={17} />
            </button>
          ) : (
            <button
              onClick={() =>
                window.alert(
                  "Review and submission will be connected after the form and backend integration are implemented."
                )
              }
              className="rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50]"
            >
              Review & Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}