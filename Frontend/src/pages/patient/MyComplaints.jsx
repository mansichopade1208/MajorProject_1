
import PatientSubPage from "./PatientSubPage";

const translations = {
  en: {
    title: "My Complaints",
    description:
      "Describe your current health concerns through a guided, conversational interview.",
    actionLabel: "Start Health Interview",
  },
  hi: {
    title: "मेरी स्वास्थ्य समस्याएँ",
    description:
      "निर्देशित बातचीत के माध्यम से अपनी वर्तमान स्वास्थ्य समस्याओं के बारे में बताएँ।",
    actionLabel: "स्वास्थ्य साक्षात्कार शुरू करें",
  },
  gu: {
    title: "મારી સ્વાસ્થ્ય સમસ્યાઓ",
    description:
      "માર્ગદર્શિત વાતચીત દ્વારા તમારી વર્તમાન સ્વાસ્થ્ય સમસ્યાઓ જણાવો.",
    actionLabel: "આરોગ્ય ઇન્ટરવ્યૂ શરૂ કરો",
  },
  mr: {
    title: "माझ्या आरोग्य समस्या",
    description:
      "मार्गदर्शित संवादाद्वारे तुमच्या सध्याच्या आरोग्य समस्यांचे वर्णन करा.",
    actionLabel: "आरोग्य मुलाखत सुरू करा",
  },
  bn: {
    title: "আমার স্বাস্থ্য সমস্যা",
    description:
      "নির্দেশিত কথোপকথনের মাধ্যমে আপনার বর্তমান স্বাস্থ্য সমস্যাগুলি জানান।",
    actionLabel: "স্বাস্থ্য সাক্ষাৎকার শুরু করুন",
  },
  ta: {
    title: "எனது உடல்நலப் பிரச்சினைகள்",
    description:
      "வழிகாட்டப்பட்ட உரையாடல் மூலம் உங்கள் தற்போதைய உடல்நலப் பிரச்சினைகளை விவரிக்கவும்.",
    actionLabel: "உடல்நல நேர்காணலைத் தொடங்கவும்",
  },
  te: {
    title: "నా ఆరోగ్య సమస్యలు",
    description:
      "మార్గదర్శక సంభాషణ ద్వారా మీ ప్రస్తుత ఆరోగ్య సమస్యలను వివరించండి.",
    actionLabel: "ఆరోగ్య ఇంటర్వ్యూను ప్రారంభించండి",
  },
  kn: {
    title: "ನನ್ನ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು",
    description:
      "ಮಾರ್ಗದರ್ಶಿತ ಸಂಭಾಷಣೆಯ ಮೂಲಕ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ವಿವರಿಸಿ.",
    actionLabel: "ಆರೋಗ್ಯ ಸಂದರ್ಶನ ಪ್ರಾರಂಭಿಸಿ",
  },
  ml: {
    title: "എന്റെ ആരോഗ്യ പ്രശ്നങ്ങൾ",
    description:
      "മാർഗനിർദേശമുള്ള സംഭാഷണത്തിലൂടെ നിങ്ങളുടെ നിലവിലെ ആരോഗ്യ പ്രശ്നങ്ങൾ വിവരിക്കുക.",
    actionLabel: "ആരോഗ്യ അഭിമുഖം ആരംഭിക്കുക",
  },
  pa: {
    title: "ਮੇਰੀਆਂ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ",
    description:
      "ਨਿਰਦੇਸ਼ਿਤ ਗੱਲਬਾਤ ਰਾਹੀਂ ਆਪਣੀਆਂ ਮੌਜੂਦਾ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਬਾਰੇ ਦੱਸੋ।",
    actionLabel: "ਸਿਹਤ ਇੰਟਰਵਿਊ ਸ਼ੁਰੂ ਕਰੋ",
  },
};

export default function MyComplaints({ language }) {
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
    <PatientSubPage
      title={t.title}
      description={t.description}
      actionLabel={t.actionLabel}
      actionPath="/patient/consultation/new"
    />
  );
}
