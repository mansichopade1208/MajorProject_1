
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, UserRound, X } from "lucide-react";

import { getLoggedInUser, getUserInitials } from "../../utils/userSession";

const translations = {
  en: {
    namaste: "Namaste",
    healthSpace: "Your personal health space",
    notifications: "Notifications",
    notificationMessage:
      "You're all caught up. New consultation updates will appear here.",
    closeNotifications: "Close notifications",
    openProfile: "Open profile menu",
    myProfile: "My Profile",
    patient: "Patient",
    emailUnavailable: "Email unavailable",
    locale: "en-IN",
  },
  hi: {
    namaste: "नमस्ते",
    healthSpace: "आपका व्यक्तिगत स्वास्थ्य स्थान",
    notifications: "सूचनाएँ",
    notificationMessage:
      "आपने सभी अपडेट देख लिए हैं। परामर्श से जुड़े नए अपडेट यहाँ दिखाई देंगे।",
    closeNotifications: "सूचनाएँ बंद करें",
    openProfile: "प्रोफ़ाइल मेनू खोलें",
    myProfile: "मेरी प्रोफ़ाइल",
    patient: "मरीज़",
    emailUnavailable: "ईमेल उपलब्ध नहीं है",
    locale: "hi-IN",
  },
  gu: {
    namaste: "નમસ્તે",
    healthSpace: "તમારું વ્યક્તિગત આરોગ્ય સ્થાન",
    notifications: "સૂચનાઓ",
    notificationMessage:
      "તમે બધા અપડેટ જોઈ લીધા છે. પરામર્શના નવા અપડેટ અહીં દેખાશે.",
    closeNotifications: "સૂચનાઓ બંધ કરો",
    openProfile: "પ્રોફાઇલ મેનૂ ખોલો",
    myProfile: "મારી પ્રોફાઇલ",
    patient: "દર્દી",
    emailUnavailable: "ઇમેઇલ ઉપલબ્ધ નથી",
    locale: "gu-IN",
  },
  mr: {
    namaste: "नमस्कार",
    healthSpace: "तुमचे वैयक्तिक आरोग्य केंद्र",
    notifications: "सूचना",
    notificationMessage:
      "तुम्ही सर्व अपडेट पाहिले आहेत. सल्लामसलतीचे नवीन अपडेट येथे दिसतील.",
    closeNotifications: "सूचना बंद करा",
    openProfile: "प्रोफाइल मेनू उघडा",
    myProfile: "माझे प्रोफाइल",
    patient: "रुग्ण",
    emailUnavailable: "ईमेल उपलब्ध नाही",
    locale: "mr-IN",
  },
  bn: {
    namaste: "নমস্কার",
    healthSpace: "আপনার ব্যক্তিগত স্বাস্থ্যকেন্দ্র",
    notifications: "বিজ্ঞপ্তি",
    notificationMessage:
      "আপনি সব আপডেট দেখে ফেলেছেন। নতুন পরামর্শের আপডেট এখানে দেখা যাবে।",
    closeNotifications: "বিজ্ঞপ্তি বন্ধ করুন",
    openProfile: "প্রোফাইল মেনু খুলুন",
    myProfile: "আমার প্রোফাইল",
    patient: "রোগী",
    emailUnavailable: "ইমেল উপলব্ধ নেই",
    locale: "bn-IN",
  },
  ta: {
    namaste: "வணக்கம்",
    healthSpace: "உங்கள் தனிப்பட்ட சுகாதாரப் பகுதி",
    notifications: "அறிவிப்புகள்",
    notificationMessage:
      "அனைத்து புதுப்பிப்புகளையும் பார்த்துவிட்டீர்கள். புதிய ஆலோசனை புதுப்பிப்புகள் இங்கே தோன்றும்.",
    closeNotifications: "அறிவிப்புகளை மூடு",
    openProfile: "சுயவிவரப் பட்டியைத் திற",
    myProfile: "எனது சுயவிவரம்",
    patient: "நோயாளர்",
    emailUnavailable: "மின்னஞ்சல் கிடைக்கவில்லை",
    locale: "ta-IN",
  },
  te: {
    namaste: "నమస్కారం",
    healthSpace: "మీ వ్యక్తిగత ఆరోగ్య స్థలం",
    notifications: "నోటిఫికేషన్‌లు",
    notificationMessage:
      "మీరు అన్ని అప్‌డేట్‌లను చూశారు. కొత్త సంప్రదింపు అప్‌డేట్‌లు ఇక్కడ కనిపిస్తాయి.",
    closeNotifications: "నోటిఫికేషన్‌లను మూసివేయండి",
    openProfile: "ప్రొఫైల్ మెనూను తెరవండి",
    myProfile: "నా ప్రొఫైల్",
    patient: "రోగి",
    emailUnavailable: "ఇమెయిల్ అందుబాటులో లేదు",
    locale: "te-IN",
  },
  kn: {
    namaste: "ನಮಸ್ಕಾರ",
    healthSpace: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ಸ್ಥಳ",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    notificationMessage:
      "ನೀವು ಎಲ್ಲಾ ನವೀಕರಣಗಳನ್ನು ನೋಡಿದ್ದೀರಿ. ಹೊಸ ಸಮಾಲೋಚನೆ ನವೀಕರಣಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.",
    closeNotifications: "ಅಧಿಸೂಚನೆಗಳನ್ನು ಮುಚ್ಚಿ",
    openProfile: "ಪ್ರೊಫೈಲ್ ಮೆನು ತೆರೆಯಿರಿ",
    myProfile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
    patient: "ರೋಗಿ",
    emailUnavailable: "ಇಮೇಲ್ ಲಭ್ಯವಿಲ್ಲ",
    locale: "kn-IN",
  },
  ml: {
    namaste: "നമസ്കാരം",
    healthSpace: "നിങ്ങളുടെ വ്യക്തിഗത ആരോഗ്യ ഇടം",
    notifications: "അറിയിപ്പുകൾ",
    notificationMessage:
      "നിങ്ങൾ എല്ലാ അപ്‌ഡേറ്റുകളും കണ്ടുകഴിഞ്ഞു. പുതിയ കൺസൾട്ടേഷൻ അപ്‌ഡേറ്റുകൾ ഇവിടെ കാണിക്കും.",
    closeNotifications: "അറിയിപ്പുകൾ അടയ്ക്കുക",
    openProfile: "പ്രൊഫൈൽ മെനു തുറക്കുക",
    myProfile: "എന്റെ പ്രൊഫൈൽ",
    patient: "രോഗി",
    emailUnavailable: "ഇമെയിൽ ലഭ്യമല്ല",
    locale: "ml-IN",
  },
  pa: {
    namaste: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    healthSpace: "ਤੁਹਾਡੀ ਨਿੱਜੀ ਸਿਹਤ ਸਪੇਸ",
    notifications: "ਸੂਚਨਾਵਾਂ",
    notificationMessage:
      "ਤੁਸੀਂ ਸਾਰੇ ਅੱਪਡੇਟ ਦੇਖ ਲਏ ਹਨ। ਨਵੀਆਂ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੀਆਂ ਸੂਚਨਾਵਾਂ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੀਆਂ।",
    closeNotifications: "ਸੂਚਨਾਵਾਂ ਬੰਦ ਕਰੋ",
    openProfile: "ਪ੍ਰੋਫਾਈਲ ਮੀਨੂ ਖੋਲ੍ਹੋ",
    myProfile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
    patient: "ਮਰੀਜ਼",
    emailUnavailable: "ਈਮੇਲ ਉਪਲਬਧ ਨਹੀਂ ਹੈ",
    locale: "pa-IN",
  },
};

export default function DashboardHeader({ language }) {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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

  const user = getLoggedInUser();

  const patientName = user?.fullName || t.patient;
  const patientEmail = user?.email || t.emailUnavailable;
  const patientInitials = getUserInitials(patientName);

  const formattedDate = new Intl.DateTimeFormat(t.locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm text-[#64776F]">{formattedDate}</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#214D43] sm:text-4xl">
          {t.namaste}, {patientName}
        </h1>

        <p className="mt-1 text-sm text-[#64776F] sm:text-base">
          {t.healthSpace}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileOpen(false);
            }}
            aria-label={t.notifications}
            aria-expanded={notificationsOpen}
            className="rounded-full p-2.5 text-[#214D43] transition hover:bg-[#E5EEE7]"
          >
            <Bell size={22} />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-[#E3E7DF] bg-white p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-[#214D43]">
                  {t.notifications}
                </h2>

                <button
                  onClick={() => setNotificationsOpen(false)}
                  aria-label={t.closeNotifications}
                >
                  <X size={17} />
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                {t.notificationMessage}
              </p>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotificationsOpen(false);
            }}
            aria-label={t.openProfile}
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-full hover:bg-[#E5EEE7]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D5E4DA] bg-[#E4EEE6] text-sm font-semibold text-[#214D43]">
              {patientInitials}
            </span>

            <ChevronDown size={15} className="text-[#64776F]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-[#E3E7DF] bg-white p-2 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="font-semibold text-[#214D43]">
                  {patientName}
                </p>

                <p className="text-xs text-gray-500">{patientEmail}</p>
              </div>

              <button
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/patient/profile");
                }}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#F0F5F0]"
              >
                <UserRound size={16} />
                {t.myProfile}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
