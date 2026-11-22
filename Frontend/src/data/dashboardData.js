
import {
  FileText,
  HeartPulse,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

export const getQuickAccessItems = (language = "en") => {
  const translations = {
    en: [
      { title: "My Documents", description: "Upload and view medical reports" },
      { title: "Medical History", description: "Add your past conditions & medicines" },
      { title: "My Complaints", description: "Describe your current symptoms" },
      { title: "My Consultations", description: "Check submission status" },
    ],
    hi: [
      { title: "मेरे दस्तावेज़", description: "मेडिकल रिपोर्ट अपलोड करें और देखें" },
      { title: "चिकित्सा इतिहास", description: "अपनी पिछली बीमारियाँ और दवाइयाँ जोड़ें" },
      { title: "मेरी समस्याएँ", description: "अपने वर्तमान लक्षण बताएँ" },
      { title: "मेरे परामर्श", description: "सबमिशन की स्थिति देखें" },
    ],
    gu: [
      { title: "મારા દસ્તાવેજો", description: "મેડિકલ રિપોર્ટ અપલોડ કરો અને જુઓ" },
      { title: "તબીબી ઇતિહાસ", description: "તમારી અગાઉની બીમારીઓ અને દવાઓ ઉમેરો" },
      { title: "મારી ફરિયાદો", description: "તમારા વર્તમાન લક્ષણો જણાવો" },
      { title: "મારા પરામર્શ", description: "સબમિશનની સ્થિતિ તપાસો" },
    ],
    mr: [
      { title: "माझी कागदपत्रे", description: "वैद्यकीय अहवाल अपलोड करा आणि पहा" },
      { title: "वैद्यकीय इतिहास", description: "तुमचे पूर्वीचे आजार आणि औषधे जोडा" },
      { title: "माझ्या तक्रारी", description: "तुमची सध्याची लक्षणे सांगा" },
      { title: "माझे सल्लामसलत", description: "सबमिशनची स्थिती तपासा" },
    ],
    bn: [
      { title: "আমার নথিপত্র", description: "মেডিকেল রিপোর্ট আপলোড করুন এবং দেখুন" },
      { title: "চিকিৎসার ইতিহাস", description: "আপনার আগের রোগ ও ওষুধ যোগ করুন" },
      { title: "আমার সমস্যা", description: "আপনার বর্তমান উপসর্গ বর্ণনা করুন" },
      { title: "আমার পরামর্শ", description: "জমা দেওয়ার অবস্থা দেখুন" },
    ],
    ta: [
      { title: "எனது ஆவணங்கள்", description: "மருத்துவ அறிக்கைகளைப் பதிவேற்றி பார்க்கவும்" },
      { title: "மருத்துவ வரலாறு", description: "முந்தைய நோய்கள் மற்றும் மருந்துகளைச் சேர்க்கவும்" },
      { title: "எனது புகார்கள்", description: "தற்போதைய அறிகுறிகளை விவரிக்கவும்" },
      { title: "எனது ஆலோசனைகள்", description: "சமர்ப்பிப்பு நிலையைப் பார்க்கவும்" },
    ],
    te: [
      { title: "నా పత్రాలు", description: "వైద్య నివేదికలను అప్‌లోడ్ చేసి చూడండి" },
      { title: "వైద్య చరిత్ర", description: "గత అనారోగ్యాలు మరియు మందులను జోడించండి" },
      { title: "నా సమస్యలు", description: "ప్రస్తుత లక్షణాలను వివరించండి" },
      { title: "నా సంప్రదింపులు", description: "సమర్పణ స్థితిని తనిఖీ చేయండి" },
    ],
    kn: [
      { title: "ನನ್ನ ದಾಖಲೆಗಳು", description: "ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ವೀಕ್ಷಿಸಿ" },
      { title: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ", description: "ಹಿಂದಿನ ಕಾಯಿಲೆಗಳು ಮತ್ತು ಔಷಧಿಗಳನ್ನು ಸೇರಿಸಿ" },
      { title: "ನನ್ನ ಸಮಸ್ಯೆಗಳು", description: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ" },
      { title: "ನನ್ನ ಸಮಾಲೋಚನೆಗಳು", description: "ಸಲ್ಲಿಕೆಯ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ" },
    ],
    ml: [
      { title: "എന്റെ രേഖകൾ", description: "മെഡിക്കൽ റിപ്പോർട്ടുകൾ അപ്‌ലോഡ് ചെയ്ത് കാണുക" },
      { title: "മെഡിക്കൽ ചരിത്രം", description: "മുൻകാല രോഗങ്ങളും മരുന്നുകളും ചേർക്കുക" },
      { title: "എന്റെ പരാതികൾ", description: "നിലവിലെ ലക്ഷണങ്ങൾ വിവരിക്കുക" },
      { title: "എന്റെ കൺസൾട്ടേഷനുകൾ", description: "സമർപ്പണ നില പരിശോധിക്കുക" },
    ],
    pa: [
      { title: "ਮੇਰੇ ਦਸਤਾਵੇਜ਼", description: "ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ ਅੱਪਲੋਡ ਕਰੋ ਅਤੇ ਵੇਖੋ" },
      { title: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ", description: "ਆਪਣੀਆਂ ਪਿਛਲੀਆਂ ਬਿਮਾਰੀਆਂ ਅਤੇ ਦਵਾਈਆਂ ਜੋੜੋ" },
      { title: "ਮੇਰੀਆਂ ਸਮੱਸਿਆਵਾਂ", description: "ਆਪਣੇ ਮੌਜੂਦਾ ਲੱਛਣ ਦੱਸੋ" },
      { title: "ਮੇਰੀਆਂ ਸਲਾਹਾਂ", description: "ਜਮ੍ਹਾਂ ਕਰਨ ਦੀ ਸਥਿਤੀ ਵੇਖੋ" },
    ],
  };

  const selectedLanguage = String(language).trim().toLowerCase();
  const translatedItems = translations[selectedLanguage] || translations.en;

  return [
    {
      ...translatedItems[0],
      icon: FileText,
      iconBg: "bg-[#D9EEE4]",
      iconColor: "text-[#216B5C]",
      path: "/patient/documents",
    },
    {
      ...translatedItems[1],
      icon: HeartPulse,
      iconBg: "bg-[#F5E7DC]",
      iconColor: "text-[#B87953]",
      path: "/patient/history",
    },
    {
      ...translatedItems[2],
      icon: MessageSquare,
      iconBg: "bg-[#D9EEE4]",
      iconColor: "text-[#216B5C]",
      path: "/patient/complaints",
    },
    {
      ...translatedItems[3],
      icon: ClipboardCheck,
      iconBg: "bg-[#EAE4F5]",
      iconColor: "text-[#7560A5]",
      path: "/patient/consultations",
    },
  ];
};

export const recentActivities = [
  {
    id: 1,
    title: "Your consultation was submitted",
    date: "20 Oct 2026 · 11:45 AM",
    status: "Submitted",
    type: "consultation",
  },
  {
    id: 2,
    title: "Medical report uploaded",
    date: "18 Oct 2026 · 04:20 PM",
    status: "Uploaded",
    type: "document",
  },
  {
    id: 3,
    title: "Account created",
    date: "15 Oct 2026 · 10:30 AM",
    status: "Completed",
    type: "account",
  },
];
