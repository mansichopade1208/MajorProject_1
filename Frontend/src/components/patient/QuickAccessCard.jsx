import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickAccessCard({ item }) {
  const navigate = useNavigate();
  const Icon = item.icon;

  return (
    <button
      onClick={() => navigate(item.path)}
      className="group flex min-h-[218px] flex-col items-start rounded-2xl border border-[#E7E7DF] bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-[#B9D5C5] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#47796E]"
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full ${item.iconBg} ${item.iconColor}`}
      >
        <Icon size={27} strokeWidth={1.8} />
      </span>

      <h3 className="mt-4 text-base font-bold text-[#214D43]">
        {item.title}
      </h3>

      <p className="mt-1 text-sm leading-5 text-[#727A74]">
        {item.description}
      </p>

      <span className="mt-auto flex w-full justify-end pt-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E4EEE7] text-[#326F61] transition group-hover:bg-[#326F61] group-hover:text-white">
          <ArrowRight size={19} />
        </span>
      </span>
    </button>
  );
}