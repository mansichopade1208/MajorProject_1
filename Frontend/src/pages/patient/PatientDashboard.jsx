
import DashboardHeader from "../../components/patient/DashboardHeader";
import WelcomeBanner from "../../components/patient/WelcomeBanner";
import QuickAccessCard from "../../components/patient/QuickAccessCard";
import SecurityNotice from "../../components/patient/SecurityNotice";

import { getQuickAccessItems } from "../../data/dashboardData";

const translations = {
  en: { quickAccess: "Quick Access" },
  hi: { quickAccess: "त्वरित पहुँच" },
  gu: { quickAccess: "ઝડપી ઍક્સેસ" },
  mr: { quickAccess: "जलद प्रवेश" },
  bn: { quickAccess: "দ্রুত অ্যাক্সেস" },
  ta: { quickAccess: "விரைவு அணுகல்" },
  te: { quickAccess: "త్వరిత ప్రాప్యత" },
  kn: { quickAccess: "ತ್ವರಿತ ಪ್ರವೇಶ" },
  ml: { quickAccess: "വേഗത്തിലുള്ള പ്രവേശനം" },
  pa: { quickAccess: "ਤੁਰੰਤ ਪਹੁੰਚ" },
};

export default function PatientDashboard() {
  const language = (
    sessionStorage.getItem("medikioskLanguage") || "en"
  ).trim().toLowerCase();

  const t = translations[language] || translations.en;
  const quickAccessItems = getQuickAccessItems(language);

  return (
    <div className="mx-auto max-w-[1500px]">
      <DashboardHeader language={language} />

      <WelcomeBanner language={language} />

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-[#214D43]">
          {t.quickAccess}
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickAccessItems.map((item) => (
            <QuickAccessCard
              key={item.path}
              item={item}
              language={language}
            />
          ))}
        </div>
      </section>

      <SecurityNotice language={language} />
    </div>
  );
}
