
import {
  Users,
  Clock,
  Check,
  CalendarDays,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats({
  totalPatients,
  pendingCount,
  reviewedCount,
  newToday,
}) {
  const stats = [
    {
      label: "Total Patients",
      value: totalPatients,
      icon: Users,
      background: "bg-[#DCEBE3]",
      iconColor: "#28685B",
    },
    {
      label: "Pending Reviews",
      value: pendingCount,
      icon: Clock,
      background: "bg-[#F5E5D9]",
      iconColor: "#C77B58",
    },
    {
      label: "Reviewed",
      value: reviewedCount,
      icon: Check,
      background: "bg-[#DCEBE3]",
      iconColor: "#28685B",
    },
    {
      label: "New Today",
      value: newToday,
      icon: CalendarDays,
      background: "bg-[#EAE4F2]",
      iconColor: "#716093",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
