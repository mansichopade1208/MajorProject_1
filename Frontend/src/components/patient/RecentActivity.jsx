import { ArrowRight, Check, FileUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const activityIcons = {
  consultation: Check,
  document: FileUp,
  account: Plus,
};

export default function RecentActivity({ activities = [] }) {
  const navigate = useNavigate();

  const openActivity = (activity) => {
    if (activity.type === "document") {
      navigate("/patient/documents");
    } else if (activity.type === "consultation") {
      navigate("/patient/consultations");
    } else {
      navigate("/patient/profile");
    }
  };

  return (
    <section className="rounded-2xl border border-[#E7E7DF] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#214D43]">
          Recent Activity
        </h2>

        <button
          onClick={() => navigate("/patient/consultations")}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#315F53] hover:underline"
        >
          View All <ArrowRight size={16} />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-xl bg-[#F7F8F4] px-4 py-8 text-center">
          <p className="font-medium text-[#315F53]">
            No activity yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Your uploads and consultations will appear here.
          </p>
        </div>
      ) : (
        <div>
          {activities.map((activity, index) => {
            const Icon = activityIcons[activity.type] || FileUp;

            return (
              <button
                key={activity.id}
                onClick={() => openActivity(activity)}
                className="group flex w-full items-start gap-3 border-b border-[#F0F0EA] py-4 text-left last:border-b-0 hover:bg-[#FAFBF8]"
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DCEDE3] text-[#326F61]">
                  <Icon size={19} />
                  {index < activities.length - 1 && (
                    <span className="absolute left-1/2 top-10 h-5 w-px -translate-x-1/2 bg-[#BDD5C6]" />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-[#254E44]">
                    {activity.title}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    {activity.date}
                  </span>
                </span>

                <span className="shrink-0 rounded-full bg-[#E0F0E5] px-2.5 py-1 text-[11px] font-semibold text-[#326F61]">
                  {activity.status}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}