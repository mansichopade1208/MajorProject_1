import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function PatientSubPage({
  title,
  description,
  actionLabel,
  actionPath,
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/patient/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#47796E] hover:underline"
      >
        <ArrowLeft size={17} />
        Back to Dashboard
      </Link>

      <div className="rounded-2xl border border-[#E7E7DF] bg-white p-6 sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
          <FileText size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-[#214D43]">
          {title}
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
          {description}
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-[#CADBD0] bg-[#F8FAF6] px-5 py-10 text-center">
          <p className="font-medium text-[#315F53]">
            Nothing to display yet
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This section is ready for its frontend implementation.
          </p>
        </div>

        {actionLabel && actionPath && (
          <Link
            to={actionPath}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50]"
          >
            {actionLabel}
            <ArrowRight size={17} />
          </Link>
        )}
      </div>
    </div>
  );
}