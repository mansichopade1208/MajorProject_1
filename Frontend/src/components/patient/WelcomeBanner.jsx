
import { ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    welcome: "Welcome to MediKiosk",
    heading: "Your health, our priority.",
    description:
      "Start a new consultation or keep track of your medical information.",
    button: "Start New Consultation",
  },
  hi: {
    welcome: "MediKiosk में आपका स्वागत है",
    heading: "आपका स्वास्थ्य, हमारी प्राथमिकता।",
    description:
      "नया परामर्श शुरू करें या अपनी चिकित्सा संबंधी जानकारी पर नज़र रखें।",
    button: "नया परामर्श शुरू करें",
  },
  gu: {
    welcome: "MediKiosk માં આપનું સ્વાગત છે",
    heading: "તમારું સ્વાસ્થ્ય, અમારી પ્રાથમિકતા.",
    description:
      "નવું પરામર્શ શરૂ કરો અથવા તમારી તબીબી માહિતી પર નજર રાખો.",
    button: "નવું પરામર્શ શરૂ કરો",
  },
  mr: {
    welcome: "MediKiosk मध्ये आपले स्वागत आहे",
    heading: "तुमचे आरोग्य, आमचे प्राधान्य.",
    description:
      "नवीन सल्लामसलत सुरू करा किंवा तुमच्या वैद्यकीय माहितीचा मागोवा ठेवा.",
    button: "नवीन सल्लामसलत सुरू करा",
  },
  bn: {
    welcome: "MediKiosk-এ আপনাকে স্বাগতম",
    heading: "আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার।",
    description:
      "নতুন পরামর্শ শুরু করুন অথবা আপনার চিকিৎসা সংক্রান্ত তথ্যের খোঁজ রাখুন।",
    button: "নতুন পরামর্শ শুরু করুন",
  },
  ta: {
    welcome: "MediKiosk-க்கு உங்களை வரவேற்கிறோம்",
    heading: "உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை.",
    description:
      "புதிய ஆலோசனையைத் தொடங்குங்கள் அல்லது உங்கள் மருத்துவத் தகவல்களைக் கண்காணிக்கவும்.",
    button: "புதிய ஆலோசனையைத் தொடங்கவும்",
  },
  te: {
    welcome: "MediKiosk కు స్వాగతం",
    heading: "మీ ఆరోగ్యం, మా ప్రాధాన్యత.",
    description:
      "కొత్త సంప్రదింపును ప్రారంభించండి లేదా మీ వైద్య సమాచారాన్ని పర్యవేక్షించండి.",
    button: "కొత్త సంప్రదింపును ప్రారంభించండి",
  },
  kn: {
    welcome: "MediKiosk ಗೆ ಸ್ವಾಗತ",
    heading: "ನಿಮ್ಮ ಆರೋಗ್ಯವೇ ನಮ್ಮ ಆದ್ಯತೆ.",
    description:
      "ಹೊಸ ಸಮಾಲೋಚನೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ ಅಥವಾ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯನ್ನು ಗಮನದಲ್ಲಿರಿಸಿಕೊಳ್ಳಿ.",
    button: "ಹೊಸ ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ",
  },
  ml: {
    welcome: "MediKiosk-ലേക്ക് സ്വാഗതം",
    heading: "നിങ്ങളുടെ ആരോഗ്യം, ഞങ്ങളുടെ മുൻഗണന.",
    description:
      "ഒരു പുതിയ കൺസൾട്ടേഷൻ ആരംഭിക്കുക അല്ലെങ്കിൽ നിങ്ങളുടെ മെഡിക്കൽ വിവരങ്ങൾ നിരീക്ഷിക്കുക.",
    button: "പുതിയ കൺസൾട്ടേഷൻ ആരംഭിക്കുക",
  },
  pa: {
    welcome: "MediKiosk ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    heading: "ਤੁਹਾਡੀ ਸਿਹਤ, ਸਾਡੀ ਪਹਿਲ।",
    description:
      "ਨਵੀਂ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਸ਼ੁਰੂ ਕਰੋ ਜਾਂ ਆਪਣੀ ਮੈਡੀਕਲ ਜਾਣਕਾਰੀ 'ਤੇ ਨਜ਼ਰ ਰੱਖੋ।",
    button: "ਨਵੀਂ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਸ਼ੁਰੂ ਕਰੋ",
  },
};

export default function WelcomeBanner({ language }) {
  const navigate = useNavigate();

  const selectedLanguage = String(
    language ??
      (typeof window !== "undefined"
        ? sessionStorage.getItem("medikioskLanguage")
        : null) ??
      "en"
  )
    .trim()
    .toLowerCase();

  const t = translations[selectedLanguage] || translations.en;

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl bg-[#E0EBE3] px-6 py-7 sm:px-8 sm:py-9">
      <div className="relative z-10 max-w-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#47796E]">
          {t.welcome}
        </p>

        <h2 className="max-w-md text-2xl font-bold leading-tight text-[#214D43] sm:text-3xl">
          {t.heading}
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-[#385E54] sm:text-base">
          {t.description}
        </p>

        <button
          onClick={() => navigate("/patient/consultation/new")}
          className="mt-5 inline-flex items-center gap-3 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#285C50] focus:outline-none focus:ring-2 focus:ring-[#47796E] focus:ring-offset-2"
        >
          <Plus size={20} />
          {t.button}
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Decorative illustration */}
      <div className="pointer-events-none absolute -bottom-12 -right-5 hidden h-64 w-64 items-center justify-center rounded-full bg-[#C9DED1] sm:flex lg:right-8">
        <div className="flex h-40 w-32 -rotate-6 flex-col items-center rounded-xl border-4 border-[#47796E] bg-[#FFFDF8] p-4 shadow-md">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#47796E] text-white">
            <Plus size={28} strokeWidth={3} />
          </div>

          <div className="mt-4 w-full space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm border-2 border-[#47796E]" />
                <span className="h-1.5 flex-1 rounded-full bg-[#D9E5DC]" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-9 right-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#C58F7B] text-white shadow-sm">
          <span className="text-3xl">♡</span>
        </div>
      </div>
    </section>
  );
}
