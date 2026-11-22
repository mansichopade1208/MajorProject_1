
import PatientSubPage from "./PatientSubPage";

const translations = {
  en: {
    title: "Help & Support",
    description:
      "Find assistance with your account, medical documents and consultations.",
  },
  hi: {
    title: "सहायता और समर्थन",
    description:
      "अपने खाते, मेडिकल दस्तावेज़ों और परामर्श से संबंधित सहायता प्राप्त करें।",
  },
  gu: {
    title: "મદદ અને સપોર્ટ",
    description:
      "તમારા એકાઉન્ટ, તબીબી દસ્તાવેજો અને પરામર્શ સંબંધિત સહાય મેળવો.",
  },
  mr: {
    title: "मदत आणि सहाय्य",
    description:
      "तुमचे खाते, वैद्यकीय कागदपत्रे आणि सल्लामसलत यांसाठी मदत मिळवा.",
  },
  bn: {
    title: "সাহায্য ও সহায়তা",
    description:
      "আপনার অ্যাকাউন্ট, চিকিৎসা সংক্রান্ত নথি এবং পরামর্শের জন্য সহায়তা পান।",
  },
  ta: {
    title: "உதவி மற்றும் ஆதரவு",
    description:
      "உங்கள் கணக்கு, மருத்துவ ஆவணங்கள் மற்றும் ஆலோசனைகள் தொடர்பான உதவியைப் பெறுங்கள்.",
  },
  te: {
    title: "సహాయం మరియు మద్దతు",
    description:
      "మీ ఖాతా, వైద్య పత్రాలు మరియు సంప్రదింపులకు సంబంధించిన సహాయాన్ని పొందండి.",
  },
  kn: {
    title: "ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ",
    description:
      "ನಿಮ್ಮ ಖಾತೆ, ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು ಮತ್ತು ಸಮಾಲೋಚನೆಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ ಸಹಾಯವನ್ನು ಪಡೆಯಿರಿ.",
  },
  ml: {
    title: "സഹായവും പിന്തുണയും",
    description:
      "നിങ്ങളുടെ അക്കൗണ്ട്, മെഡിക്കൽ രേഖകൾ, കൺസൾട്ടേഷനുകൾ എന്നിവയ്ക്കുള്ള സഹായം നേടുക.",
  },
  pa: {
    title: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ",
    description:
      "ਆਪਣੇ ਖਾਤੇ, ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ਾਂ ਅਤੇ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਲਈ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ।",
  },
};

export default function Help({ language }) {
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
    />
  );
}
