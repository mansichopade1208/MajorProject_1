
import { useNavigate } from "react-router-dom";
import {
  Zap,
  UserRound,
  FileCheck2,
  ArrowRight,
} from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "View New Patient",
      description: "Check details and documents",
      icon: UserRound,
      path: "/doctor/patients",
      background: "bg-[#DCEBE3] hover:bg-[#dfeae2]",
      iconBackground: "bg-[#d9e8df]",
      iconColor: "#527c70",
    },
    {
      title: "Review Pending Cases",
      description: "Go through AI summaries",
      icon: FileCheck2,
      path: "/doctor/reviews",
      background: "bg-[#F5E5D9] hover:bg-[#f7dacc]",
      iconBackground: "bg-[#f6d7c8]",
      iconColor: "#c46e53",
    },
  ];

  return (
    <section className="bg-white/65 border border-[#e8dfd6]
    rounded-2xl p-4 sm:p-5 shadow-sm">

      <h2 className="text-xl font-bold flex items-center gap-3 mb-5">
        <Zap size={25} />
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={`${action.background} rounded-2xl p-4
              flex items-center gap-4 text-left transition group`}
            >
              <div className={`${action.iconBackground} w-16 h-16
              shrink-0 rounded-full flex items-center justify-center`}>
                <Icon size={32} style={{ color: action.iconColor }} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-base">
                  {action.title}
                </h3>
                <p className="text-xs mt-1 text-[#52645f]">
                  {action.description}
                </p>
              </div>

              <ArrowRight
                size={23}
                className="group-hover:translate-x-1 transition"
              />
            </button>
          );
        })}

      </div>
    </section>
  );
}
