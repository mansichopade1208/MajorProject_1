import DashboardHeader from "../../components/patient/DashboardHeader";
import WelcomeBanner from "../../components/patient/WelcomeBanner";
import QuickAccessCard from "../../components/patient/QuickAccessCard";
import RecentActivity from "../../components/patient/RecentActivity";
import HealthSummary from "../../components/patient/HealthSummary";
import SecurityNotice from "../../components/patient/SecurityNotice";

import {
  quickAccessItems,
  recentActivities,
} from "../../data/dashboardData";

export default function PatientDashboard() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <DashboardHeader />

      <WelcomeBanner />

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-[#214D43]">
          Quick Access
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickAccessItems.map((item) => (
            <QuickAccessCard key={item.path} item={item} />
          ))}
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2">
        <RecentActivity activities={recentActivities} />
        <HealthSummary />
      </section>

      <SecurityNotice />
    </div>
  );
}