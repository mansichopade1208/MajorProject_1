
import { Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import ayushmanLogo from "../assets/ayushman-logo.jpg";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
];

export default function MediKioskHeader({
  selectedLanguage = "en",
  onLanguageChange,
}) {
  function handleLanguageChange(event) {
    const code = event.target.value;

    sessionStorage.setItem("medikioskLanguage", code);

    if (onLanguageChange) {
      onLanguageChange(code);
    }
  }

  return (
    <header className="w-full border-t-[3px] border-[#3F3F3F] bg-white">
      {/* Main header */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-[10%]">
        {/* Clickable logo and branding */}
        <Link
          to="/"
          aria-label="MediKiosk home"
          className="flex shrink-0 items-center gap-3 no-underline"
        >
          <img
            src={ayushmanLogo}
            alt="Ayushman Bharat Digital Mission"
            className="h-14 w-14 shrink-0 object-contain"
          />

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#214A43] sm:text-2xl">
              MediKiosk
            </h1>

            <p className="text-xs text-[#47796F] sm:text-sm">
              Ayushman Bharat Digital Health Mission
            </p>
          </div>
        </Link>

        {/* Ministry and language selector */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden border-r border-[#DDE5DE] pr-4 text-right sm:block">
            <p className="text-sm font-medium text-[#214A43]">
              Ministry of Health &amp; Family Welfare
            </p>

            <p className="text-sm text-[#6C9C8C]">
              Government of India
            </p>
          </div>

          <Globe2
            size={25}
            className="shrink-0 text-[#47796F]"
          />

          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            aria-label="Select language"
            className="w-[142px] rounded-xl border border-[#D5E5DA] bg-white px-3 py-4 text-sm text-[#214A43] outline-none focus:border-[#47796F] focus:ring-2 focus:ring-[#47796F]/20"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mission bar */}
      <div className="bg-[#47796F] px-4 py-2.5 text-center text-sm font-bold text-white">
        MediKiosk — Ayushman Bharat Digital Health Mission
      </div>
    </header>
  );
}
