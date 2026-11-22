
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Plus,
  LayoutDashboard,
  FileText,
  HeartPulse,
  ClipboardList,
  UserRound,
  CircleHelp,
  Headset,
  LogOut,
  X,
} from "lucide-react";

const translations = {
  en: {
    patientPortal: "Patient portal",
    dashboard: "Dashboard",
    documents: "My Documents",
    history: "Medical History",
    consultations: "My Consultations",
    profile: "Profile",
    help: "Help",
    needHelp: "Need help?",
    supportDescription: "Contact support if you need assistance.",
    contactSupport: "Contact support",
    logOut: "Log Out",
    logoutTitle: "Log out?",
    logoutMessage: "Are you sure you want to leave your patient portal?",
    cancel: "Cancel",
    close: "Close dialog",
  },
  hi: {
    patientPortal: "रोगी पोर्टल",
    dashboard: "डैशबोर्ड",
    documents: "मेरे दस्तावेज़",
    history: "चिकित्सा इतिहास",
    consultations: "मेरे परामर्श",
    profile: "प्रोफ़ाइल",
    help: "सहायता",
    needHelp: "मदद चाहिए?",
    supportDescription: "सहायता के लिए सपोर्ट टीम से संपर्क करें।",
    contactSupport: "सपोर्ट से संपर्क करें",
    logOut: "लॉग आउट",
    logoutTitle: "लॉग आउट करें?",
    logoutMessage: "क्या आप वाकई अपना रोगी पोर्टल छोड़ना चाहते हैं?",
    cancel: "रद्द करें",
    close: "डायलॉग बंद करें",
  },
  gu: {
    patientPortal: "દર્દી પોર્ટલ",
    dashboard: "ડેશબોર્ડ",
    documents: "મારા દસ્તાવેજો",
    history: "તબીબી ઇતિહાસ",
    consultations: "મારા પરામર્શ",
    profile: "પ્રોફાઇલ",
    help: "મદદ",
    needHelp: "મદદ જોઈએ છે?",
    supportDescription: "સહાય માટે સપોર્ટ ટીમનો સંપર્ક કરો.",
    contactSupport: "સપોર્ટનો સંપર્ક કરો",
    logOut: "લૉગ આઉટ",
    logoutTitle: "લૉગ આઉટ કરવું છે?",
    logoutMessage: "શું તમે ખરેખર તમારું દર્દી પોર્ટલ છોડવા માંગો છો?",
    cancel: "રદ કરો",
    close: "સંવાદ બંધ કરો",
  },
  mr: {
    patientPortal: "रुग्ण पोर्टल",
    dashboard: "डॅशबोर्ड",
    documents: "माझी कागदपत्रे",
    history: "वैद्यकीय इतिहास",
    consultations: "माझे सल्ले",
    profile: "प्रोफाइल",
    help: "मदत",
    needHelp: "मदत हवी आहे?",
    supportDescription: "मदतीसाठी सपोर्ट टीमशी संपर्क साधा.",
    contactSupport: "सपोर्टशी संपर्क साधा",
    logOut: "लॉग आउट",
    logoutTitle: "लॉग आउट करायचे?",
    logoutMessage: "तुम्हाला तुमचे रुग्ण पोर्टल सोडायचे आहे का?",
    cancel: "रद्द करा",
    close: "डायलॉग बंद करा",
  },
  bn: {
    patientPortal: "রোগী পোর্টাল",
    dashboard: "ড্যাশবোর্ড",
    documents: "আমার নথিপত্র",
    history: "চিকিৎসার ইতিহাস",
    consultations: "আমার পরামর্শ",
    profile: "প্রোফাইল",
    help: "সাহায্য",
    needHelp: "সাহায্য প্রয়োজন?",
    supportDescription: "সাহায্যের জন্য সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
    contactSupport: "সাপোর্টের সাথে যোগাযোগ করুন",
    logOut: "লগ আউট",
    logoutTitle: "লগ আউট করবেন?",
    logoutMessage: "আপনি কি নিশ্চিত যে রোগী পোর্টাল থেকে বের হতে চান?",
    cancel: "বাতিল করুন",
    close: "ডায়ালগ বন্ধ করুন",
  },
  ta: {
    patientPortal: "நோயாளர் தளம்",
    dashboard: "முகப்புப் பலகை",
    documents: "எனது ஆவணங்கள்",
    history: "மருத்துவ வரலாறு",
    consultations: "எனது ஆலோசனைகள்",
    profile: "சுயவிவரம்",
    help: "உதவி",
    needHelp: "உதவி தேவையா?",
    supportDescription: "உதவி தேவைப்பட்டால் ஆதரவு குழுவைத் தொடர்புகொள்ளவும்.",
    contactSupport: "ஆதரவைத் தொடர்புகொள்ளவும்",
    logOut: "வெளியேறு",
    logoutTitle: "வெளியேற வேண்டுமா?",
    logoutMessage: "உங்கள் நோயாளர் தளத்திலிருந்து வெளியேற விரும்புகிறீர்களா?",
    cancel: "ரத்துசெய்",
    close: "உரையாடலை மூடு",
  },
  te: {
    patientPortal: "రోగి పోర్టల్",
    dashboard: "డ్యాష్‌బోర్డ్",
    documents: "నా పత్రాలు",
    history: "వైద్య చరిత్ర",
    consultations: "నా సంప్రదింపులు",
    profile: "ప్రొఫైల్",
    help: "సహాయం",
    needHelp: "సహాయం కావాలా?",
    supportDescription: "సహాయం కోసం సపోర్ట్ బృందాన్ని సంప్రదించండి.",
    contactSupport: "సపోర్ట్‌ను సంప్రదించండి",
    logOut: "లాగ్ అవుట్",
    logoutTitle: "లాగ్ అవుట్ చేయాలా?",
    logoutMessage: "మీరు నిజంగా మీ రోగి పోర్టల్ నుండి బయటకు వెళ్లాలనుకుంటున్నారా?",
    cancel: "రద్దు చేయండి",
    close: "డైలాగ్‌ను మూసివేయండి",
  },
  kn: {
    patientPortal: "ರೋಗಿ ಪೋರ್ಟಲ್",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    documents: "ನನ್ನ ದಾಖಲೆಗಳು",
    history: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    consultations: "ನನ್ನ ಸಮಾಲೋಚನೆಗಳು",
    profile: "ಪ್ರೊಫೈಲ್",
    help: "ಸಹಾಯ",
    needHelp: "ಸಹಾಯ ಬೇಕೇ?",
    supportDescription: "ಸಹಾಯಕ್ಕಾಗಿ ಬೆಂಬಲ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    contactSupport: "ಬೆಂಬಲವನ್ನು ಸಂಪರ್ಕಿಸಿ",
    logOut: "ಲಾಗ್ ಔಟ್",
    logoutTitle: "ಲಾಗ್ ಔಟ್ ಮಾಡಬೇಕೇ?",
    logoutMessage: "ನಿಮ್ಮ ರೋಗಿ ಪೋರ್ಟಲ್‌ನಿಂದ ಹೊರಹೋಗಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?",
    cancel: "ರದ್ದುಮಾಡಿ",
    close: "ಸಂವಾದವನ್ನು ಮುಚ್ಚಿ",
  },
  ml: {
    patientPortal: "രോഗി പോർട്ടൽ",
    dashboard: "ഡാഷ്ബോർഡ്",
    documents: "എന്റെ രേഖകൾ",
    history: "മെഡിക്കൽ ചരിത്രം",
    consultations: "എന്റെ കൺസൾട്ടേഷനുകൾ",
    profile: "പ്രൊഫൈൽ",
    help: "സഹായം",
    needHelp: "സഹായം ആവശ്യമുണ്ടോ?",
    supportDescription: "സഹായത്തിനായി സപ്പോർട്ട് ടീമുമായി ബന്ധപ്പെടുക.",
    contactSupport: "സപ്പോർട്ടുമായി ബന്ധപ്പെടുക",
    logOut: "ലോഗ് ഔട്ട്",
    logoutTitle: "ലോഗ് ഔട്ട് ചെയ്യണോ?",
    logoutMessage: "നിങ്ങളുടെ രോഗി പോർട്ടലിൽ നിന്ന് പുറത്തുകടക്കണമെന്ന് ഉറപ്പാണോ?",
    cancel: "റദ്ദാക്കുക",
    close: "ഡയലോഗ് അടയ്ക്കുക",
  },
  pa: {
    patientPortal: "ਮਰੀਜ਼ ਪੋਰਟਲ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    documents: "ਮੇਰੇ ਦਸਤਾਵੇਜ਼",
    history: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
    consultations: "ਮੇਰੀਆਂ ਸਲਾਹਾਂ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    help: "ਮਦਦ",
    needHelp: "ਮਦਦ ਦੀ ਲੋੜ ਹੈ?",
    supportDescription: "ਸਹਾਇਤਾ ਲਈ ਸਪੋਰਟ ਟੀਮ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।",
    contactSupport: "ਸਪੋਰਟ ਨਾਲ ਸੰਪਰਕ ਕਰੋ",
    logOut: "ਲੌਗ ਆਉਟ",
    logoutTitle: "ਲੌਗ ਆਉਟ ਕਰਨਾ ਹੈ?",
    logoutMessage: "ਕੀ ਤੁਸੀਂ ਯਕੀਨੀ ਤੌਰ 'ਤੇ ਆਪਣਾ ਮਰੀਜ਼ ਪੋਰਟਲ ਛੱਡਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    cancel: "ਰੱਦ ਕਰੋ",
    close: "ਡਾਇਲਾਗ ਬੰਦ ਕਰੋ",
  },
};

export default function Sidebar({ mobile = false, language }) {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

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

  const navigation = [
    {
      label: t.dashboard,
      path: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t.documents,
      path: "/patient/documents",
      icon: FileText,
    },
    {
      label: t.history,
      path: "/patient/history",
      icon: HeartPulse,
    },
    {
      label: t.consultations,
      path: "/patient/consultations",
      icon: ClipboardList,
    },
    {
      label: t.profile,
      path: "/patient/profile",
      icon: UserRound,
    },
    {
      label: t.help,
      path: "/patient/help",
      icon: CircleHelp,
    },
  ];

  const handleLogout = () => {
    // Replace with your existing authentication logout function.
    navigate("/login");
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex-col bg-[#17483F] px-4 py-6 text-white ${
          mobile ? "flex w-full" : "hidden w-[216px] lg:flex"
        }`}
      >
        <NavLink
          to="/patient/dashboard"
          className="mb-12 flex items-center gap-2.5 px-1"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F8878]">
            <Plus size={29} strokeWidth={3.5} />
          </span>

          <span>
            <span className="block text-lg font-bold tracking-tight">
              MediKiosk
            </span>
            <span className="block text-[10px] text-[#D1E3DC]">
              {t.patientPortal}
            </span>
          </span>
        </NavLink>

        <nav className="flex-1 space-y-2">
          {navigation.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-[#F6F7F1] font-semibold text-[#17483F] shadow-sm"
                    : "text-[#E0EDE7] hover:bg-white/10"
                }`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="rounded-xl border border-white/10 bg-white/[0.08] p-3">
          <div className="flex items-center gap-2">
            <Headset size={20} />
            <p className="text-sm font-semibold">{t.needHelp}</p>
          </div>

          <p className="mt-1 text-xs text-[#D1E3DC]">
            {t.supportDescription}
          </p>

          <button
            onClick={() => navigate("/patient/help")}
            className="mt-3 w-full rounded-lg border border-white/50 py-2 text-sm hover:bg-white/10"
          >
            {t.contactSupport}
          </button>
        </div>

        <button
          onClick={() => setShowLogout(true)}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-white/50 py-3 text-sm font-medium hover:bg-white/10"
        >
          <LogOut size={17} />
          {t.logOut}
        </button>
      </aside>

      {/* Logout confirmation */}
      {showLogout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-[#244E45] shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="logout-title" className="text-lg font-bold">
                {t.logoutTitle}
              </h2>

              <button
                onClick={() => setShowLogout(false)}
                aria-label={t.close}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              {t.logoutMessage}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                {t.cancel}
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-[#47796E] px-4 py-2 text-sm font-medium text-white"
              >
                {t.logOut}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
