
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import MediKioskHeader from "../components/MediKioskHeader";

const translations = {
  en: {
    title: "Welcome to MediKiosk",
    subtitle: "Are you visiting for the first time, or have you been here before?",
    newTitle: "New Patient",
    newDesc: "First time here? Register now.",
    oldTitle: "Returning Patient",
    oldDesc: "Already registered? Welcome back.",
    home: "Home",
  },
  hi: {
    title: "मेडिकियोस्क में आपका स्वागत है",
    subtitle: "क्या आप पहली बार आ रहे हैं, या पहले भी आ चुके हैं?",
    newTitle: "नया मरीज",
    newDesc: "पहली बार आए हैं? अभी रजिस्टर करें।",
    oldTitle: "पुराना मरीज",
    oldDesc: "पहले से रजिस्टर हैं? आपका स्वागत है।",
    home: "होम",
  },
  bn: {
    title: "মেডিকিওস্কে আপনাকে স্বাগতম",
    subtitle: "আপনি কি প্রথমবার আসছেন, নাকি আগেও এসেছেন?",
    newTitle: "নতুন রোগী",
    newDesc: "প্রথমবার এসেছেন? এখনই নিবন্ধন করুন।",
    oldTitle: "আগের রোগী",
    oldDesc: "আগেই নিবন্ধিত? আবার স্বাগতম।",
    home: "হোম",
  },
  mr: {
    title: "मेडिकिओस्कमध्ये आपले स्वागत आहे",
    subtitle: "तुम्ही पहिल्यांदा आला आहात की यापूर्वीही आला आहात?",
    newTitle: "नवीन रुग्ण",
    newDesc: "पहिल्यांदा आला आहात? आता नोंदणी करा.",
    oldTitle: "आधीचा रुग्ण",
    oldDesc: "आधीच नोंदणी केली आहे? पुन्हा स्वागत आहे.",
    home: "मुख्यपृष्ठ",
  },
  ta: {
    title: "MediKiosk-க்கு வரவேற்கிறோம்",
    subtitle: "நீங்கள் முதல் முறையாக வருகிறீர்களா அல்லது ஏற்கனவே வந்துள்ளீர்களா?",
    newTitle: "புதிய நோயாளி",
    newDesc: "முதல் முறையா? இப்போது பதிவு செய்யுங்கள்.",
    oldTitle: "மீண்டும் வரும் நோயாளி",
    oldDesc: "ஏற்கனவே பதிவு செய்துள்ளீர்களா? மீண்டும் வரவேற்கிறோம்.",
    home: "முகப்பு",
  },
  te: {
    title: "MediKiosk కు స్వాగతం",
    subtitle: "మీరు మొదటిసారి వస్తున్నారా లేదా ఇంతకు ముందు వచ్చారా?",
    newTitle: "కొత్త రోగి",
    newDesc: "మొదటిసారి వచ్చారా? ఇప్పుడే నమోదు చేసుకోండి.",
    oldTitle: "తిరిగి వచ్చిన రోగి",
    oldDesc: "ఇప్పటికే నమోదు చేసుకున్నారా? స్వాగతం.",
    home: "హోమ్",
  },
  gu: {
    title: "MediKiosk માં આપનું સ્વાગત છે",
    subtitle: "શું તમે પહેલી વાર આવ્યા છો કે પહેલાં પણ આવ્યા છો?",
    newTitle: "નવા દર્દી",
    newDesc: "પહેલી વાર આવ્યા છો? હમણાં નોંધણી કરો.",
    oldTitle: "પહેલેથી આવેલા દર્દી",
    oldDesc: "પહેલેથી નોંધણી કરાવી છે? ફરી સ્વાગત છે.",
    home: "હોમ",
  },
  kn: {
    title: "MediKiosk ಗೆ ಸ್ವಾಗತ",
    subtitle: "ನೀವು ಮೊದಲ ಬಾರಿಗೆ ಬರುತ್ತಿದ್ದೀರಾ ಅಥವಾ ಮೊದಲು ಬಂದಿದ್ದೀರಾ?",
    newTitle: "ಹೊಸ ರೋಗಿ",
    newDesc: "ಮೊದಲ ಬಾರಿಯೇ? ಈಗ ನೋಂದಾಯಿಸಿ.",
    oldTitle: "ಮರಳಿ ಬಂದ ರೋಗಿ",
    oldDesc: "ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ? ಮತ್ತೆ ಸ್ವಾಗತ.",
    home: "ಮುಖಪುಟ",
  },
  ml: {
    title: "MediKiosk-ലേക്ക് സ്വാഗതം",
    subtitle: "നിങ്ങൾ ആദ്യമായാണോ വരുന്നത്, അതോ മുമ്പ് വന്നിട്ടുണ്ടോ?",
    newTitle: "പുതിയ രോഗി",
    newDesc: "ആദ്യമായാണോ? ഇപ്പോൾ രജിസ്റ്റർ ചെയ്യുക.",
    oldTitle: "മടങ്ങിയെത്തിയ രോഗി",
    oldDesc: "ഇതിനകം രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടോ? വീണ്ടും സ്വാഗതം.",
    home: "ഹോം",
  },
  pa: {
    title: "MediKiosk ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    subtitle: "ਕੀ ਤੁਸੀਂ ਪਹਿਲੀ ਵਾਰ ਆਏ ਹੋ ਜਾਂ ਪਹਿਲਾਂ ਵੀ ਆ ਚੁੱਕੇ ਹੋ?",
    newTitle: "ਨਵਾਂ ਮਰੀਜ਼",
    newDesc: "ਪਹਿਲੀ ਵਾਰ ਆਏ ਹੋ? ਹੁਣੇ ਰਜਿਸਟਰ ਕਰੋ।",
    oldTitle: "ਪਹਿਲਾਂ ਆਇਆ ਮਰੀਜ਼",
    oldDesc: "ਪਹਿਲਾਂ ਹੀ ਰਜਿਸਟਰ ਹੋ? ਮੁੜ ਸੁਆਗਤ ਹੈ।",
    home: "ਘਰ",
  },
};

export default function PatientType() {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(
    () => sessionStorage.getItem("medikioskLanguage") || "en"
  );

  const t = translations[selectedLanguage] || translations.en;

  function changeLanguage(code) {
    setSelectedLanguage(code);
    sessionStorage.setItem("medikioskLanguage", code);
  }

  function goToSignup() {
    navigate("/signup", {
      state: { language: selectedLanguage, patientType: "new" },
    });
  }

  function goToLogin() {
    navigate("/login", {
      state: { language: selectedLanguage, patientType: "returning" },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F5F0] to-[#FAF8F2] text-[#214A43]">
      <MediKioskHeader
        selectedLanguage={selectedLanguage}
        onLanguageChange={changeLanguage}
      />

      <main className="mx-auto flex min-h-[calc(100vh-150px)] max-w-6xl flex-col items-center px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10 max-w-2xl text-center">
          <h1
            className="text-3xl font-bold tracking-tight text-[#214A43] sm:text-4xl"
            lang={selectedLanguage}
          >
            {t.title}
          </h1>

          <p
            className="mt-3 text-base leading-7 text-[#627C74] sm:text-lg"
            lang={selectedLanguage}
          >
            {t.subtitle}
          </p>
        </div>

        <div className="grid w-full max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <button
            type="button"
            onClick={goToSignup}
            className="group flex min-h-[245px] flex-col items-center justify-center rounded-xl border border-[#E0E7DF] bg-white px-6 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#6C9C8C] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47796F]"
          >
            <span className="text-5xl" aria-hidden="true">🏥</span>

            <h2
              lang={selectedLanguage}
              className="mt-5 text-2xl font-bold text-[#214A43]"
            >
              {t.newTitle}
            </h2>

            <p
              lang={selectedLanguage}
              className="mt-4 text-base leading-7 text-[#71847B]"
            >
              {t.newDesc}
            </p>

            <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#47796F]">
              <span>{t.newTitle}</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          <button
            type="button"
            onClick={goToLogin}
            className="group flex min-h-[245px] flex-col items-center justify-center rounded-xl border border-[#E0E7DF] bg-white px-6 py-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-[#6C9C8C] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#47796F]"
          >
            <span className="text-5xl" aria-hidden="true">🙋</span>

            <h2
              lang={selectedLanguage}
              className="mt-5 text-2xl font-bold text-[#214A43]"
            >
              {t.oldTitle}
            </h2>

            <p
              lang={selectedLanguage}
              className="mt-4 text-base leading-7 text-[#71847B]"
            >
              {t.oldDesc}
            </p>

            <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#47796F]">
              <span>{t.oldTitle}</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-[#DCE6DD] bg-white px-5 py-3 font-medium text-[#315E54] shadow-sm transition hover:bg-[#F0F5F0]"
        >
          <ArrowLeft size={18} />
          {t.home}
        </button>
      </main>
    </div>
  );
}
