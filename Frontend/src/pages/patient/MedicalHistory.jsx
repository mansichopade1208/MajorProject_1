
import { useState } from "react";
import {
  Activity,
  Pill,
  AlertTriangle,
  Scissors,
  Plus,
  X,
  CalendarDays,
  ClipboardList,
  HeartPulse,
  Trash2,
} from "lucide-react";

const initialRecords = {
  conditions: [],
  medications: [],
  allergies: [],
  surgeries: [],
};

const categories = [
  { id: "conditions", icon: Activity },
  { id: "medications", icon: Pill },
  { id: "allergies", icon: AlertTriangle },
  { id: "surgeries", icon: Scissors },
];

const emptyForm = {
  title: "",
  details: "",
  date: "",
};

const translations = {
  en: {
    title: "Medical History",
    description: "Keep track of your health conditions, medications and medical records.",
    addMedicalRecord: "Add Medical Record",
    yourRecords: "Your Medical Records",
    recordsAdded: "Records Added",
    conditions: "Conditions",
    medications: "Medications",
    allergies: "Allergies",
    surgeries: "Surgeries",
    view: "View your",
    records: "records",
    add: "Add",
    noRecords: "No records added yet",
    emptyDescription: "Add your medical information to maintain a complete health history.",
    addRecord: "Add Record",
    remove: "Remove",
    recordCategory: "Record Category",
    conditionName: "Condition Name",
    medicineName: "Medicine Name",
    allergyName: "Allergy Name",
    surgeryName: "Surgery Name",
    enterName: "Enter name",
    additionalDetails: "Additional Details",
    detailsPlaceholder: "Add dosage, severity, notes or other details...",
    date: "Date",
    cancel: "Cancel",
  },
  hi: {
    title: "चिकित्सा इतिहास",
    description: "अपनी स्वास्थ्य समस्याओं, दवाओं और मेडिकल रिकॉर्ड का विवरण रखें।",
    addMedicalRecord: "मेडिकल रिकॉर्ड जोड़ें",
    yourRecords: "आपके मेडिकल रिकॉर्ड",
    recordsAdded: "रिकॉर्ड जोड़े गए",
    conditions: "स्वास्थ्य समस्याएँ",
    medications: "दवाएँ",
    allergies: "एलर्जी",
    surgeries: "सर्जरी",
    view: "देखें",
    records: "रिकॉर्ड",
    add: "जोड़ें",
    noRecords: "अभी तक कोई रिकॉर्ड नहीं जोड़ा गया",
    emptyDescription: "अपना पूरा स्वास्थ्य इतिहास बनाए रखने के लिए मेडिकल जानकारी जोड़ें।",
    addRecord: "रिकॉर्ड जोड़ें",
    remove: "हटाएँ",
    recordCategory: "रिकॉर्ड की श्रेणी",
    conditionName: "समस्या का नाम",
    medicineName: "दवा का नाम",
    allergyName: "एलर्जी का नाम",
    surgeryName: "सर्जरी का नाम",
    enterName: "नाम दर्ज करें",
    additionalDetails: "अतिरिक्त विवरण",
    detailsPlaceholder: "खुराक, गंभीरता, नोट्स या अन्य विवरण जोड़ें...",
    date: "तारीख",
    cancel: "रद्द करें",
  },
  gu: {
    title: "તબીબી ઇતિહાસ",
    description: "તમારી સ્વાસ્થ્ય સમસ્યાઓ, દવાઓ અને તબીબી રેકોર્ડનો હિસાબ રાખો.",
    addMedicalRecord: "તબીબી રેકોર્ડ ઉમેરો",
    yourRecords: "તમારા તબીબી રેકોર્ડ",
    recordsAdded: "રેકોર્ડ ઉમેરાયા",
    conditions: "સ્વાસ્થ્ય સમસ્યાઓ",
    medications: "દવાઓ",
    allergies: "એલર્જી",
    surgeries: "સર્જરી",
    view: "જુઓ",
    records: "રેકોર્ડ",
    add: "ઉમેરો",
    noRecords: "હજુ સુધી કોઈ રેકોર્ડ ઉમેરાયો નથી",
    emptyDescription: "સંપૂર્ણ સ્વાસ્થ્ય ઇતિહાસ જાળવવા માટે તમારી તબીબી માહિતી ઉમેરો.",
    addRecord: "રેકોર્ડ ઉમેરો",
    remove: "દૂર કરો",
    recordCategory: "રેકોર્ડનો પ્રકાર",
    conditionName: "સમસ્યાનું નામ",
    medicineName: "દવાનું નામ",
    allergyName: "એલર્જીનું નામ",
    surgeryName: "સર્જરીનું નામ",
    enterName: "નામ દાખલ કરો",
    additionalDetails: "વધારાની વિગતો",
    detailsPlaceholder: "ડોઝ, ગંભીરતા, નોંધો અથવા અન્ય વિગતો ઉમેરો...",
    date: "તારીખ",
    cancel: "રદ કરો",
  },
  mr: {
    title: "वैद्यकीय इतिहास",
    description: "तुमच्या आरोग्य समस्या, औषधे आणि वैद्यकीय नोंदींची माहिती ठेवा.",
    addMedicalRecord: "वैद्यकीय नोंद जोडा",
    yourRecords: "तुमच्या वैद्यकीय नोंदी",
    recordsAdded: "नोंदी जोडल्या",
    conditions: "आरोग्य समस्या",
    medications: "औषधे",
    allergies: "ॲलर्जी",
    surgeries: "शस्त्रक्रिया",
    view: "पहा",
    records: "नोंदी",
    add: "जोडा",
    noRecords: "अद्याप कोणतीही नोंद जोडलेली नाही",
    emptyDescription: "संपूर्ण आरोग्य इतिहास ठेवण्यासाठी तुमची वैद्यकीय माहिती जोडा.",
    addRecord: "नोंद जोडा",
    remove: "काढून टाका",
    recordCategory: "नोंदीचा प्रकार",
    conditionName: "समस्येचे नाव",
    medicineName: "औषधाचे नाव",
    allergyName: "ॲलर्जीचे नाव",
    surgeryName: "शस्त्रक्रियेचे नाव",
    enterName: "नाव लिहा",
    additionalDetails: "अतिरिक्त तपशील",
    detailsPlaceholder: "औषधाचा डोस, तीव्रता, नोंदी किंवा इतर तपशील जोडा...",
    date: "तारीख",
    cancel: "रद्द करा",
  },
  bn: {
    title: "চিকিৎসার ইতিহাস",
    description: "আপনার স্বাস্থ্য সমস্যা, ওষুধ এবং চিকিৎসার নথি সংরক্ষণ করুন।",
    addMedicalRecord: "চিকিৎসার নথি যোগ করুন",
    yourRecords: "আপনার চিকিৎসার নথি",
    recordsAdded: "টি নথি যোগ করা হয়েছে",
    conditions: "স্বাস্থ্য সমস্যা",
    medications: "ওষুধ",
    allergies: "অ্যালার্জি",
    surgeries: "অস্ত্রোপচার",
    view: "দেখুন",
    records: "নথি",
    add: "যোগ করুন",
    noRecords: "এখনও কোনো নথি যোগ করা হয়নি",
    emptyDescription: "সম্পূর্ণ স্বাস্থ্য ইতিহাস সংরক্ষণ করতে আপনার চিকিৎসার তথ্য যোগ করুন।",
    addRecord: "নথি যোগ করুন",
    remove: "মুছে ফেলুন",
    recordCategory: "নথির বিভাগ",
    conditionName: "সমস্যার নাম",
    medicineName: "ওষুধের নাম",
    allergyName: "অ্যালার্জির নাম",
    surgeryName: "অস্ত্রোপচারের নাম",
    enterName: "নাম লিখুন",
    additionalDetails: "অতিরিক্ত বিবরণ",
    detailsPlaceholder: "ডোজ, তীব্রতা, নোট বা অন্যান্য বিবরণ যোগ করুন...",
    date: "তারিখ",
    cancel: "বাতিল করুন",
  },
  ta: {
    title: "மருத்துவ வரலாறு",
    description: "உங்கள் உடல்நலப் பிரச்சினைகள், மருந்துகள் மற்றும் மருத்துவப் பதிவுகளைக் கண்காணிக்கவும்.",
    addMedicalRecord: "மருத்துவப் பதிவைச் சேர்க்கவும்",
    yourRecords: "உங்கள் மருத்துவப் பதிவுகள்",
    recordsAdded: "பதிவுகள் சேர்க்கப்பட்டன",
    conditions: "உடல்நலப் பிரச்சினைகள்",
    medications: "மருந்துகள்",
    allergies: "ஒவ்வாமைகள்",
    surgeries: "அறுவை சிகிச்சைகள்",
    view: "பார்க்கவும்",
    records: "பதிவுகள்",
    add: "சேர்க்கவும்",
    noRecords: "இதுவரை பதிவுகள் எதுவும் சேர்க்கப்படவில்லை",
    emptyDescription: "முழுமையான உடல்நல வரலாற்றைப் பராமரிக்க உங்கள் மருத்துவத் தகவல்களைச் சேர்க்கவும்.",
    addRecord: "பதிவைச் சேர்க்கவும்",
    remove: "நீக்கவும்",
    recordCategory: "பதிவு வகை",
    conditionName: "பிரச்சினையின் பெயர்",
    medicineName: "மருந்தின் பெயர்",
    allergyName: "ஒவ்வாமையின் பெயர்",
    surgeryName: "அறுவை சிகிச்சையின் பெயர்",
    enterName: "பெயரை உள்ளிடவும்",
    additionalDetails: "கூடுதல் விவரங்கள்",
    detailsPlaceholder: "மருந்தளவு, தீவிரம், குறிப்புகள் அல்லது பிற விவரங்களைச் சேர்க்கவும்...",
    date: "தேதி",
    cancel: "ரத்துசெய்",
  },
  te: {
    title: "వైద్య చరిత్ర",
    description: "మీ ఆరోగ్య సమస్యలు, మందులు మరియు వైద్య రికార్డులను నమోదు చేయండి.",
    addMedicalRecord: "వైద్య రికార్డును జోడించండి",
    yourRecords: "మీ వైద్య రికార్డులు",
    recordsAdded: "రికార్డులు జోడించబడ్డాయి",
    conditions: "ఆరోగ్య సమస్యలు",
    medications: "మందులు",
    allergies: "అలర్జీలు",
    surgeries: "శస్త్రచికిత్సలు",
    view: "చూడండి",
    records: "రికార్డులు",
    add: "జోడించండి",
    noRecords: "ఇంకా రికార్డులు ఏవీ జోడించబడలేదు",
    emptyDescription: "పూర్తి ఆరోగ్య చరిత్రను నిర్వహించడానికి మీ వైద్య సమాచారాన్ని జోడించండి.",
    addRecord: "రికార్డును జోడించండి",
    remove: "తొలగించండి",
    recordCategory: "రికార్డు వర్గం",
    conditionName: "సమస్య పేరు",
    medicineName: "మందు పేరు",
    allergyName: "అలర్జీ పేరు",
    surgeryName: "శస్త్రచికిత్స పేరు",
    enterName: "పేరు నమోదు చేయండి",
    additionalDetails: "అదనపు వివరాలు",
    detailsPlaceholder: "మోతాదు, తీవ్రత, గమనికలు లేదా ఇతర వివరాలను జోడించండి...",
    date: "తేదీ",
    cancel: "రద్దు చేయండి",
  },
  kn: {
    title: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    description: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು, ಔಷಧಿಗಳು ಮತ್ತು ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    addMedicalRecord: "ವೈದ್ಯಕೀಯ ದಾಖಲೆಯನ್ನು ಸೇರಿಸಿ",
    yourRecords: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    recordsAdded: "ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಲಾಗಿದೆ",
    conditions: "ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳು",
    medications: "ಔಷಧಿಗಳು",
    allergies: "ಅಲರ್ಜಿಗಳು",
    surgeries: "ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗಳು",
    view: "ವೀಕ್ಷಿಸಿ",
    records: "ದಾಖಲೆಗಳು",
    add: "ಸೇರಿಸಿ",
    noRecords: "ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಲಾಗಿಲ್ಲ",
    emptyDescription: "ಸಂಪೂರ್ಣ ಆರೋಗ್ಯ ಇತಿಹಾಸವನ್ನು ನಿರ್ವಹಿಸಲು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯನ್ನು ಸೇರಿಸಿ.",
    addRecord: "ದಾಖಲೆ ಸೇರಿಸಿ",
    remove: "ತೆಗೆದುಹಾಕಿ",
    recordCategory: "ದಾಖಲೆಯ ವರ್ಗ",
    conditionName: "ಸಮಸ್ಯೆಯ ಹೆಸರು",
    medicineName: "ಔಷಧಿಯ ಹೆಸರು",
    allergyName: "ಅಲರ್ಜಿಯ ಹೆಸರು",
    surgeryName: "ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯ ಹೆಸರು",
    enterName: "ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    additionalDetails: "ಹೆಚ್ಚುವರಿ ವಿವರಗಳು",
    detailsPlaceholder: "ಪ್ರಮಾಣ, ತೀವ್ರತೆ, ಟಿಪ್ಪಣಿಗಳು ಅಥವಾ ಇತರ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ...",
    date: "ದಿನಾಂಕ",
    cancel: "ರದ್ದುಮಾಡಿ",
  },
  ml: {
    title: "മെഡിക്കൽ ചരിത്രം",
    description: "നിങ്ങളുടെ ആരോഗ്യപ്രശ്നങ്ങൾ, മരുന്നുകൾ, മെഡിക്കൽ രേഖകൾ എന്നിവ സൂക്ഷിക്കുക.",
    addMedicalRecord: "മെഡിക്കൽ രേഖ ചേർക്കുക",
    yourRecords: "നിങ്ങളുടെ മെഡിക്കൽ രേഖകൾ",
    recordsAdded: "രേഖകൾ ചേർത്തു",
    conditions: "ആരോഗ്യപ്രശ്നങ്ങൾ",
    medications: "മരുന്നുകൾ",
    allergies: "അലർജികൾ",
    surgeries: "ശസ്ത്രക്രിയകൾ",
    view: "കാണുക",
    records: "രേഖകൾ",
    add: "ചേർക്കുക",
    noRecords: "ഇതുവരെ രേഖകളൊന്നും ചേർത്തിട്ടില്ല",
    emptyDescription: "പൂർണ്ണമായ ആരോഗ്യചരിത്രം സൂക്ഷിക്കാൻ നിങ്ങളുടെ മെഡിക്കൽ വിവരങ്ങൾ ചേർക്കുക.",
    addRecord: "രേഖ ചേർക്കുക",
    remove: "നീക്കം ചെയ്യുക",
    recordCategory: "രേഖയുടെ വിഭാഗം",
    conditionName: "പ്രശ്നത്തിന്റെ പേര്",
    medicineName: "മരുന്നിന്റെ പേര്",
    allergyName: "അലർജിയുടെ പേര്",
    surgeryName: "ശസ്ത്രക്രിയയുടെ പേര്",
    enterName: "പേര് നൽകുക",
    additionalDetails: "കൂടുതൽ വിവരങ്ങൾ",
    detailsPlaceholder: "ഡോസ്, തീവ്രത, കുറിപ്പുകൾ അല്ലെങ്കിൽ മറ്റ് വിവരങ്ങൾ ചേർക്കുക...",
    date: "തീയതി",
    cancel: "റദ്ദാക്കുക",
  },
  pa: {
    title: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
    description: "ਆਪਣੀਆਂ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ, ਦਵਾਈਆਂ ਅਤੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡਾਂ ਦਾ ਵੇਰਵਾ ਰੱਖੋ।",
    addMedicalRecord: "ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਸ਼ਾਮਲ ਕਰੋ",
    yourRecords: "ਤੁਹਾਡੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ",
    recordsAdded: "ਰਿਕਾਰਡ ਸ਼ਾਮਲ ਕੀਤੇ ਗਏ",
    conditions: "ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ",
    medications: "ਦਵਾਈਆਂ",
    allergies: "ਐਲਰਜੀਆਂ",
    surgeries: "ਸਰਜਰੀਆਂ",
    view: "ਵੇਖੋ",
    records: "ਰਿਕਾਰਡ",
    add: "ਸ਼ਾਮਲ ਕਰੋ",
    noRecords: "ਹਾਲੇ ਕੋਈ ਰਿਕਾਰਡ ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ",
    emptyDescription: "ਪੂਰਾ ਸਿਹਤ ਇਤਿਹਾਸ ਬਣਾਈ ਰੱਖਣ ਲਈ ਆਪਣੀ ਮੈਡੀਕਲ ਜਾਣਕਾਰੀ ਸ਼ਾਮਲ ਕਰੋ।",
    addRecord: "ਰਿਕਾਰਡ ਸ਼ਾਮਲ ਕਰੋ",
    remove: "ਹਟਾਓ",
    recordCategory: "ਰਿਕਾਰਡ ਦੀ ਸ਼੍ਰੇਣੀ",
    conditionName: "ਸਮੱਸਿਆ ਦਾ ਨਾਮ",
    medicineName: "ਦਵਾਈ ਦਾ ਨਾਮ",
    allergyName: "ਐਲਰਜੀ ਦਾ ਨਾਮ",
    surgeryName: "ਸਰਜਰੀ ਦਾ ਨਾਮ",
    enterName: "ਨਾਮ ਦਰਜ ਕਰੋ",
    additionalDetails: "ਵਾਧੂ ਵੇਰਵੇ",
    detailsPlaceholder: "ਖੁਰਾਕ, ਗੰਭੀਰਤਾ, ਨੋਟਸ ਜਾਂ ਹੋਰ ਵੇਰਵੇ ਸ਼ਾਮਲ ਕਰੋ...",
    date: "ਤਾਰੀਖ",
    cancel: "ਰੱਦ ਕਰੋ",
  },
};

export default function MedicalHistory({ language }) {
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

  const [records, setRecords] = useState(initialRecords);
  const [activeCategory, setActiveCategory] = useState("conditions");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const totalRecords = Object.values(records).reduce(
    (total, items) => total + items.length,
    0
  );

  const getCategoryLabel = (id) => t[id];

  const getRecordNameLabel = () => {
    const labels = {
      conditions: t.conditionName,
      medications: t.medicineName,
      allergies: t.allergyName,
      surgeries: t.surgeryName,
    };

    return labels[activeCategory];
  };

  const handleAddRecord = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    setRecords((prev) => ({
      ...prev,
      [activeCategory]: [
        ...prev[activeCategory],
        {
          id: Date.now(),
          ...formData,
        },
      ],
    }));

    setFormData(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (category, id) => {
    setRecords((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  const activeInfo = categories.find(
    (category) => category.id === activeCategory
  );

  const ActiveIcon = activeInfo.icon;

  return (
    <div className="min-h-full space-y-6 bg-[#FFFDF8] pb-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#244C43]">
            {t.title}
          </h1>
          <p className="mt-2 text-sm text-[#718078]">
            {t.description}
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42695C]"
        >
          <Plus size={18} />
          {t.addMedicalRecord}
        </button>
      </div>

      {/* Overview Banner */}
      <div className="rounded-2xl border border-[#DCE9DF] bg-gradient-to-r from-[#EAF4EE] to-[#CFEAE3] p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4F7C6D] text-white">
            <HeartPulse size={28} />
          </div>

          <div>
            <p className="text-sm font-medium text-[#527267]">
              {t.yourRecords}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#244C43]">
              {totalRecords} {t.recordsAdded}
            </h2>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          const label = getCategoryLabel(category.id);

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-2xl border p-5 text-left transition ${
                isActive
                  ? "border-[#6FAF9B] bg-[#EAF4EE] shadow-sm"
                  : "border-[#E9E8DF] bg-white hover:border-[#CFEAE3]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CFEAE3] text-[#4F7C6D]">
                  <Icon size={21} />
                </div>

                <span className="text-2xl font-bold text-[#244C43]">
                  {records[category.id].length}
                </span>
              </div>

              <h3 className="mt-4 font-semibold text-[#31594E]">
                {label}
              </h3>
              <p className="mt-1 text-xs text-[#87918A]">
                {t.view} {label.toLowerCase()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Records Section */}
      <div className="rounded-2xl border border-[#E9E8DF] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#CFEAE3] text-[#4F7C6D]">
              <ActiveIcon size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#244C43]">
                {getCategoryLabel(activeCategory)}
              </h2>
              <p className="text-sm text-[#87918A]">
                {records[activeCategory].length} {t.records}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#CFEAE3] bg-[#F0F7F2] px-4 py-2.5 text-sm font-semibold text-[#4F7C6D] transition hover:bg-[#EAF4EE]"
          >
            <Plus size={16} />
            {t.add} {getCategoryLabel(activeCategory)}
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {records[activeCategory].length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DCE5DD] bg-[#FFFDF8] px-5 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF4EE] text-[#6FAF9B]">
                <ClipboardList size={27} />
              </div>

              <h3 className="mt-4 font-semibold text-[#31594E]">
                {t.noRecords}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-[#87918A]">
                {t.emptyDescription}
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#42695C]"
              >
                <Plus size={16} />
                {t.addRecord}
              </button>
            </div>
          ) : (
            records[activeCategory].map((record) => (
              <div
                key={record.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-[#E9E8DF] bg-[#FFFDF8] p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-[#31594E]">
                    {record.title}
                  </h3>

                  {record.details && (
                    <p className="mt-1 text-sm text-[#718078]">
                      {record.details}
                    </p>
                  )}

                  {record.date && (
                    <p className="mt-2 flex items-center gap-2 text-xs text-[#87918A]">
                      <CalendarDays size={14} />
                      {record.date}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    handleDelete(activeCategory, record.id)
                  }
                  className="flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm text-[#B47765] transition hover:bg-[#F8EDE7] sm:self-center"
                >
                  <Trash2 size={16} />
                  {t.remove}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Record Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#244C43]/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#244C43]">
                  {t.addMedicalRecord}
                </h2>
                <p className="mt-1 text-sm text-[#87918A]">
                  {t.description}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData(emptyForm);
                }}
                className="rounded-lg p-2 text-[#718078] hover:bg-[#F5F6F0]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  {t.recordCategory}
                </label>

                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {getCategoryLabel(category.id)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  {getRecordNameLabel()}
                </label>

                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  placeholder={t.enterName}
                  className="w-full rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  {t.additionalDetails}
                </label>

                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: e.target.value,
                    })
                  }
                  placeholder={t.detailsPlaceholder}
                  className="w-full resize-none rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  {t.date}
                </label>

                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#E5E7DF] bg-[#FFFDF8] px-4 py-3 text-sm text-[#31534C] outline-none focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData(emptyForm);
                  }}
                  className="rounded-xl border border-[#DCE5DD] px-5 py-3 text-sm font-semibold text-[#52665D] hover:bg-[#F5F8F5]"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#42695C]"
                >
                  <Plus size={17} />
                  {t.addRecord}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
