
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MediKioskHeader from "../components/MediKioskHeader";
import {
  Languages,
  Globe2,
  ArrowRight,
  Check,
} from "lucide-react";

import ayushmanLogo from "../assets/ayushman-logo.jpg";

const languages = [
  {
    code: "en", letter: "E", name: "English", native: "English",
    title: "Choose your language",
    subtitle: "Choose the language you feel most comfortable speaking.",
    continueText: "Continue",
    steps: ["Login", "Language", "Consent", "Interview", "Documents", "Summary", "Done"],
  },
  {
    code: "hi", letter: "ह", name: "हिन्दी", native: "Hindi",
    title: "अपनी भाषा चुनें",
    subtitle: "जिस भाषा में बोलने में आप सहज हैं, वह चुनें।",
    continueText: "आगे बढ़ें",
    steps: ["लॉगिन", "भाषा", "सहमति", "इंटरव्यू", "दस्तावेज़", "सारांश", "पूरा"],
  },
  {
    code: "bn", letter: "ব", name: "বাংলা", native: "Bengali",
    title: "আপনার ভাষা বেছে নিন",
    subtitle: "যে ভাষায় কথা বলতে আপনি স্বচ্ছন্দ, সেটি বেছে নিন।",
    continueText: "এগিয়ে যান",
    steps: ["লগইন", "ভাষা", "সম্মতি", "সাক্ষাৎকার", "নথি", "সারাংশ", "সম্পন্ন"],
  },
  {
    code: "ta", letter: "த", name: "தமிழ்", native: "Tamil",
    title: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    subtitle: "நீங்கள் வசதியாகப் பேசும் மொழியைத் தேர்ந்தெடுக்கவும்.",
    continueText: "தொடரவும்",
    steps: ["உள்நுழைவு", "மொழி", "ஒப்புதல்", "நேர்காணல்", "ஆவணங்கள்", "சுருக்கம்", "முடிந்தது"],
  },
  {
    code: "te", letter: "తె", name: "తెలుగు", native: "Telugu",
    title: "మీ భాషను ఎంచుకోండి",
    subtitle: "మీరు సౌకర్యంగా మాట్లాడగలిగే భాషను ఎంచుకోండి.",
    continueText: "కొనసాగించండి",
    steps: ["లాగిన్", "భాష", "సమ్మతి", "ఇంటర్వ్యూ", "పత్రాలు", "సారాంశం", "పూర్తి"],
  },
  {
    code: "mr", letter: "म", name: "मराठी", native: "Marathi",
    title: "तुमची भाषा निवडा",
    subtitle: "तुम्हाला सहज बोलता येणारी भाषा निवडा.",
    continueText: "पुढे जा",
    steps: ["लॉगिन", "भाषा", "संमती", "मुलाखत", "कागदपत्रे", "सारांश", "पूर्ण"],
  },
  {
    code: "gu", letter: "ગ", name: "ગુજરાતી", native: "Gujarati",
    title: "તમારી ભાષા પસંદ કરો",
    subtitle: "જે ભાષામાં તમે સહજતાથી વાત કરી શકો તે પસંદ કરો.",
    continueText: "આગળ વધો",
    steps: ["લૉગિન", "ભાષા", "સંમતિ", "ઇન્ટરવ્યૂ", "દસ્તાવેજો", "સારાંશ", "પૂર્ણ"],
  },
  {
    code: "kn", letter: "ಕ", name: "ಕನ್ನಡ", native: "Kannada",
    title: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    subtitle: "ನೀವು ಆರಾಮವಾಗಿ ಮಾತನಾಡುವ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    continueText: "ಮುಂದುವರಿಸಿ",
    steps: ["ಲಾಗಿನ್", "ಭಾಷೆ", "ಒಪ್ಪಿಗೆ", "ಸಂದರ್ಶನ", "ದಾಖಲೆಗಳು", "ಸಾರಾಂಶ", "ಪೂರ್ಣ"],
  },
  {
    code: "ml", letter: "മ", name: "മലയാളം", native: "Malayalam",
    title: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    subtitle: "നിങ്ങൾക്ക് സുഖമായി സംസാരിക്കാൻ കഴിയുന്ന ഭാഷ തിരഞ്ഞെടുക്കുക.",
    continueText: "തുടരുക",
    steps: ["ലോഗിൻ", "ഭാഷ", "സമ്മതം", "അഭിമുഖം", "രേഖകൾ", "സംഗ്രഹം", "പൂർത്തിയായി"],
  },
  {
    code: "pa", letter: "ਪੰ", name: "ਪੰਜਾਬੀ", native: "Punjabi",
    title: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
    subtitle: "ਉਹ ਭਾਸ਼ਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਆਰਾਮ ਨਾਲ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ।",
    continueText: "ਅੱਗੇ ਵਧੋ",
    steps: ["ਲਾਗਇਨ", "ਭਾਸ਼ਾ", "ਸਹਿਮਤੀ", "ਇੰਟਰਵਿਊ", "ਦਸਤਾਵੇਜ਼", "ਸਾਰ", "ਮੁਕੰਮਲ"],
  },
];

export default function LanguageSelection() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(
    () => sessionStorage.getItem("medikioskLanguage") || "en"
  );

  const language =
    languages.find((item) => item.code === selected) || languages[0];

  // Language first, Login second
  const stepLabels = [
    language.steps[1],
    language.steps[0],
    ...language.steps.slice(2),
  ];

  function changeLanguage(code) {
    setSelected(code);
    sessionStorage.setItem("medikioskLanguage", code);
  }

  function continueToNextStep() {
  sessionStorage.setItem("medikioskLanguage", selected);

  navigate("/patient-type", {
    state: { language: selected },
  });
}

  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#214A43]">
    {/* Header */}
    <MediKioskHeader
  selectedLanguage={selected}
  onLanguageChange={changeLanguage}
/>

      {/* Progress bar */}
      <nav
        aria-label="Patient intake steps"
        className="border-b border-[#E4E8DF] bg-white/70 px-3 py-4 sm:px-6"
      >
        <ol className="mx-auto grid max-w-5xl grid-cols-7 gap-1">
          {stepLabels.map((step, index) => (
            <li
              key={`${language.code}-${index}`}
              className={`relative flex min-w-0 flex-col items-center gap-1.5 text-center text-[10px] sm:text-sm ${
                index === 0
                  ? "font-semibold text-[#315E54]"
                  : "text-[#8B9C93]"
              }`}
            >
              {index > 0 && (
                <span className="absolute right-1/2 top-3.5 -z-0 hidden h-[2px] w-full bg-[#DDE7DF] sm:block" />
              )}

              <span
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs sm:h-8 sm:w-8 sm:text-sm ${
                  index === 0
                    ? "border-[#47796F] bg-[#47796F] text-white"
                    : "border-[#D5E0D7] bg-white text-[#8B9C93]"
                }`}
              >
                {index === 0 ? <Check size={16} /> : index + 1}
              </span>

              <span className="px-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Main content */}
      <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-7 sm:px-8 sm:pt-8 lg:px-[7%]">
        {/* Welcome banner: original layout, MediKiosk colors */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#315E54] to-[#6C9C8C] px-5 py-7 text-center shadow-lg sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full border border-white/15" />
          <div className="pointer-events-none absolute -bottom-12 -right-8 h-36 w-36 rounded-full border border-white/15" />

          <div className="relative mx-auto mb-4 flex h-20 w-28 items-center justify-center rounded-lg bg-white p-1">
            <img
              src={ayushmanLogo}
              alt="Ayushman Bharat Digital Mission"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="relative text-xl font-bold text-[#FAF8F2] sm:text-2xl">
              MediKisok
          </h1>

          <p className="relative mt-2 text-sm text-white/85 sm:text-base">
            Digital Health Mission — AI-Powered Patient Intake Kiosk
          </p>
        </div>

        {/* Language heading */}
        <div className="mx-auto mt-8 max-w-4xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#A7CBB9] bg-[#E6EFE7] text-[#315E54]">
            <Languages size={35} strokeWidth={1.7} />
          </div>

          <h2
            lang={language.code}
            className="mt-4 text-3xl font-bold tracking-tight text-[#214A43] sm:text-4xl"
          >
            {language.title}
          </h2>

          <p
            lang={language.code}
            className="mx-auto mt-3 max-w-2xl text-base leading-7 text-[#627C74] sm:text-xl"
          >
            {language.subtitle}
          </p>
        </div>

        {/* Language cards: same grid and layout */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {languages.map((item) => {
            const isSelected = selected === item.code;

            return (
              <button
                key={item.code}
                type="button"
                onClick={() => changeLanguage(item.code)}
                aria-pressed={isSelected}
                className={`group relative flex min-h-36 flex-col items-center justify-center rounded-xl border bg-white px-3 py-5 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47796F] ${
                  isSelected
                    ? "border-[#47796F] bg-[#F0F5F0] ring-2 ring-[#D5E5DA]"
                    : "border-[#E4E8DF] hover:border-[#A7CBB9]"
                }`}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#47796F] text-white">
                    <Check size={12} />
                  </span>
                )}

                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#315E54] to-[#6C9C8C] text-2xl font-bold text-white shadow-sm">
                  {item.letter}
                </span>

                <span
                  lang={item.code}
                  className="mt-3 text-lg font-bold text-[#214A43]"
                >
                  {item.name}
                </span>

                <span className="mt-1 text-xs text-[#627C74]">
                  ({item.native})
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="mt-7 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={continueToNextStep}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#47796F] px-8 py-3 font-semibold text-white shadow-md transition hover:bg-[#315E54] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6C9C8C]"
          >
            {language.continueText}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          
        </div>
      </section>
    </main>
  );
}
