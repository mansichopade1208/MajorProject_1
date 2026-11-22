
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Activity,
  HeartPulse,
  ClipboardList,
  AlertCircle,
  FileText,
  Pill,
  ShieldAlert,
  CheckCircle2,
  Stethoscope,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import ConversationalInterview from "../../components/patient/Newconsultation/ConversationalInterview.jsx";
import MedicalHistory from "../../components/patient/Newconsultation/MedicalHistory.jsx";
import MedicalDocumentUpload from "../../components/patient/Newconsultation/MedicalDocumentUpload.jsx";
import ConsultationReview from "../../components/patient/Newconsultation/ConsultationReview.jsx";
import { submitConsultation } from "../../../services/consultationService.js";

const SECTION_STYLE =
  "rounded-xl border border-[#E2E8ED] bg-white p-5";

const translations = {
  en: {
    steps: [
      [
        "Tell us what brings you here",
        "Describe your current symptoms. The AI assistant will ask relevant follow-up questions.",
      ],
      [
        "Your medical history",
        "Provide information about past illnesses, existing conditions, allergies and medications.",
      ],
      [
        "Upload medical documents",
        "Upload relevant prescriptions, laboratory reports or discharge summaries.",
      ],
      [
        "Review and submit",
        "Review your information before generating the consultation report.",
      ],
    ],
    step: "Step",
    of: "of",
    previous: "Previous",
    continue: "Continue",
    backDashboard: "Back to Dashboard",
    submit: "Generate Consultation Report",
    generating: "Generating report...",
    interviewError: "Please complete the patient interview first.",
    reportError: "The server did not return a valid consultation report.",
    submitError: "Unable to generate the report. Please try again.",
  },

  hi: {
    steps: [
      [
        "आप यहाँ क्यों आए हैं?",
        "अपने वर्तमान लक्षणों के बारे में बताएं। AI सहायक आपसे संबंधित प्रश्न पूछेगा।",
      ],
      [
        "आपका चिकित्सा इतिहास",
        "पिछली बीमारियों, मौजूदा स्थितियों, एलर्जी और दवाओं के बारे में जानकारी दें।",
      ],
      [
        "चिकित्सा दस्तावेज़ अपलोड करें",
        "प्रिस्क्रिप्शन, लैब रिपोर्ट या डिस्चार्ज सारांश अपलोड करें।",
      ],
      [
        "जाँचें और सबमिट करें",
        "परामर्श रिपोर्ट बनाने से पहले अपनी जानकारी जाँच लें।",
      ],
    ],
    step: "चरण",
    of: "में से",
    previous: "पिछला",
    continue: "आगे बढ़ें",
    backDashboard: "डैशबोर्ड पर वापस जाएँ",
    submit: "परामर्श रिपोर्ट बनाएँ",
    generating: "रिपोर्ट बनाई जा रही है...",
    interviewError: "कृपया पहले मरीज का इंटरव्यू पूरा करें।",
    reportError: "सर्वर से मान्य परामर्श रिपोर्ट प्राप्त नहीं हुई।",
    submitError: "रिपोर्ट नहीं बन सकी। कृपया पुनः प्रयास करें।",
  },

  gu: {
    steps: [
      [
        "તમને અહીં શું લાવ્યું છે?",
        "તમારા વર્તમાન લક્ષણો જણાવો. AI સહાયક સંબંધિત પ્રશ્નો પૂછશે.",
      ],
      [
        "તમારો તબીબી ઇતિહાસ",
        "જૂની બીમારીઓ, હાલની સ્થિતિ, એલર્જી અને દવાઓ વિશે માહિતી આપો.",
      ],
      [
        "તબીબી દસ્તાવેજો અપલોડ કરો",
        "પ્રિસ્ક્રિપ્શન, લેબ રિપોર્ટ અથવા ડિસ્ચાર્જ સારાંશ અપલોડ કરો.",
      ],
      [
        "તપાસો અને સબમિટ કરો",
        "કન્સલ્ટેશન રિપોર્ટ બનાવતા પહેલાં તમારી માહિતી તપાસો.",
      ],
    ],
    step: "પગલું",
    of: "માંથી",
    previous: "પાછળ",
    continue: "આગળ વધો",
    backDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
    submit: "કન્સલ્ટેશન રિપોર્ટ બનાવો",
    generating: "રિપોર્ટ બનાવાઈ રહ્યો છે...",
    interviewError: "કૃપા કરીને પહેલાં દર્દીનો ઇન્ટરવ્યૂ પૂર્ણ કરો.",
    reportError: "સર્વર તરફથી માન્ય રિપોર્ટ મળ્યો નથી.",
    submitError: "રિપોર્ટ બનાવી શકાયો નથી. ફરી પ્રયાસ કરો.",
  },

  mr: {
    steps: [
      [
        "तुम्ही येथे का आला आहात?",
        "तुमची सध्याची लक्षणे सांगा. AI सहाय्यक संबंधित प्रश्न विचारेल.",
      ],
      [
        "तुमचा वैद्यकीय इतिहास",
        "मागील आजार, सध्याच्या समस्या, ॲलर्जी आणि औषधांची माहिती द्या.",
      ],
      [
        "वैद्यकीय कागदपत्रे अपलोड करा",
        "प्रिस्क्रिप्शन, प्रयोगशाळेचे अहवाल किंवा डिस्चार्ज सारांश अपलोड करा.",
      ],
      [
        "तपासा आणि सबमिट करा",
        "सल्लामसलत अहवाल तयार करण्यापूर्वी माहिती तपासा.",
      ],
    ],
    step: "टप्पा",
    of: "पैकी",
    previous: "मागे",
    continue: "पुढे जा",
    backDashboard: "डॅशबोर्डवर परत जा",
    submit: "सल्लामसलत अहवाल तयार करा",
    generating: "अहवाल तयार होत आहे...",
    interviewError: "कृपया प्रथम रुग्णाची मुलाखत पूर्ण करा.",
    reportError: "सर्व्हरकडून वैध अहवाल मिळाला नाही.",
    submitError: "अहवाल तयार करता आला नाही. पुन्हा प्रयत्न करा.",
  },

  bn: {
    steps: [
      [
        "আপনি কেন এখানে এসেছেন?",
        "আপনার বর্তমান উপসর্গ বর্ণনা করুন। AI সহকারী প্রাসঙ্গিক প্রশ্ন করবে।",
      ],
      [
        "আপনার চিকিৎসার ইতিহাস",
        "আগের অসুস্থতা, বর্তমান সমস্যা, অ্যালার্জি এবং ওষুধের তথ্য দিন।",
      ],
      [
        "চিকিৎসার নথি আপলোড করুন",
        "প্রেসক্রিপশন, ল্যাব রিপোর্ট বা ডিসচার্জ সারাংশ আপলোড করুন।",
      ],
      [
        "পর্যালোচনা করুন এবং জমা দিন",
        "পরামর্শের রিপোর্ট তৈরির আগে তথ্য যাচাই করুন।",
      ],
    ],
    step: "ধাপ",
    of: "এর মধ্যে",
    previous: "পূর্ববর্তী",
    continue: "এগিয়ে যান",
    backDashboard: "ড্যাশবোর্ডে ফিরে যান",
    submit: "পরামর্শের রিপোর্ট তৈরি করুন",
    generating: "রিপোর্ট তৈরি হচ্ছে...",
    interviewError: "অনুগ্রহ করে প্রথমে রোগীর সাক্ষাৎকার সম্পূর্ণ করুন।",
    reportError: "সার্ভার থেকে বৈধ রিপোর্ট পাওয়া যায়নি।",
    submitError: "রিপোর্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।",
  },

  ta: {
    steps: [
      [
        "உங்களை இங்கு அழைத்து வந்தது என்ன?",
        "உங்கள் தற்போதைய அறிகுறிகளை விவரிக்கவும். AI உதவியாளர் தொடர்புடைய கேள்விகளைக் கேட்பார்.",
      ],
      [
        "உங்கள் மருத்துவ வரலாறு",
        "முந்தைய நோய்கள், தற்போதைய நிலைகள், ஒவ்வாமைகள் மற்றும் மருந்துகள் பற்றிய தகவல்களை வழங்கவும்.",
      ],
      [
        "மருத்துவ ஆவணங்களைப் பதிவேற்றவும்",
        "மருந்துச் சீட்டுகள், ஆய்வக அறிக்கைகள் அல்லது வெளியேற்றச் சுருக்கங்களைப் பதிவேற்றவும்.",
      ],
      [
        "மதிப்பாய்வு செய்து சமர்ப்பிக்கவும்",
        "ஆலோசனை அறிக்கையை உருவாக்குவதற்கு முன் தகவல்களைச் சரிபார்க்கவும்.",
      ],
    ],
    step: "படி",
    of: "இல்",
    previous: "முந்தையது",
    continue: "தொடரவும்",
    backDashboard: "டாஷ்போர்டுக்குத் திரும்பு",
    submit: "ஆலோசனை அறிக்கையை உருவாக்கு",
    generating: "அறிக்கை உருவாக்கப்படுகிறது...",
    interviewError: "முதலில் நோயாளியின் நேர்காணலை முடிக்கவும்.",
    reportError: "சரியான ஆலோசனை அறிக்கை சேவையகத்திலிருந்து கிடைக்கவில்லை.",
    submitError: "அறிக்கையை உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  },

  te: {
    steps: [
      [
        "మీరు ఇక్కడికి ఎందుకు వచ్చారు?",
        "మీ ప్రస్తుత లక్షణాలను వివరించండి. AI సహాయకుడు సంబంధిత ప్రశ్నలు అడుగుతాడు.",
      ],
      [
        "మీ వైద్య చరిత్ర",
        "గత అనారోగ్యాలు, ప్రస్తుత పరిస్థితులు, అలర్జీలు మరియు మందుల వివరాలు ఇవ్వండి.",
      ],
      [
        "వైద్య పత్రాలను అప్‌లోడ్ చేయండి",
        "ప్రిస్క్రిప్షన్‌లు, ల్యాబ్ రిపోర్టులు లేదా డిశ్చార్జ్ సారాంశాలను అప్‌లోడ్ చేయండి.",
      ],
      [
        "సమీక్షించి సమర్పించండి",
        "కన్సల్టేషన్ నివేదికను రూపొందించే ముందు సమాచారాన్ని తనిఖీ చేయండి.",
      ],
    ],
    step: "దశ",
    of: "లో",
    previous: "మునుపటి",
    continue: "కొనసాగించండి",
    backDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి",
    submit: "కన్సల్టేషన్ నివేదిక రూపొందించండి",
    generating: "నివేదిక రూపొందుతోంది...",
    interviewError: "దయచేసి ముందుగా రోగి ఇంటర్వ్యూను పూర్తి చేయండి.",
    reportError: "సర్వర్ నుండి సరైన నివేదిక అందలేదు.",
    submitError: "నివేదికను రూపొందించలేకపోయాము. మళ్లీ ప్రయత్నించండి.",
  },

  kn: {
    steps: [
      [
        "ನೀವು ಇಲ್ಲಿಗೆ ಏಕೆ ಬಂದಿದ್ದೀರಿ?",
        "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ. AI ಸಹಾಯಕ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳುತ್ತದೆ.",
      ],
      [
        "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
        "ಹಿಂದಿನ ಕಾಯಿಲೆಗಳು, ಪ್ರಸ್ತುತ ಸಮಸ್ಯೆಗಳು, ಅಲರ್ಜಿಗಳು ಮತ್ತು ಔಷಧಿಗಳ ಮಾಹಿತಿ ನೀಡಿ.",
      ],
      [
        "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
        "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು, ಲ್ಯಾಬ್ ವರದಿಗಳು ಅಥವಾ ಡಿಸ್ಚಾರ್ಜ್ ಸಾರಾಂಶಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      ],
      [
        "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ",
        "ಸಮಾಲೋಚನಾ ವರದಿಯನ್ನು ರಚಿಸುವ ಮೊದಲು ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
      ],
    ],
    step: "ಹಂತ",
    of: "ರಲ್ಲಿ",
    previous: "ಹಿಂದಿನದು",
    continue: "ಮುಂದುವರಿಸಿ",
    backDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    submit: "ಸಮಾಲೋಚನಾ ವರದಿ ರಚಿಸಿ",
    generating: "ವರದಿ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    interviewError: "ದಯವಿಟ್ಟು ಮೊದಲು ರೋಗಿಯ ಸಂದರ್ಶನವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
    reportError: "ಸರ್ವರ್‌ನಿಂದ ಮಾನ್ಯ ವರದಿ ದೊರಕಿಲ್ಲ.",
    submitError: "ವರದಿಯನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  },

  ml: {
    steps: [
      [
        "നിങ്ങൾ ഇവിടെ വന്നതിന്റെ കാരണം എന്താണ്?",
        "നിങ്ങളുടെ നിലവിലെ ലക്ഷണങ്ങൾ വിവരിക്കുക. AI സഹായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾ ചോദിക്കും.",
      ],
      [
        "നിങ്ങളുടെ മെഡിക്കൽ ചരിത്രം",
        "മുൻ രോഗങ്ങൾ, നിലവിലെ അവസ്ഥകൾ, അലർജികൾ, മരുന്നുകൾ എന്നിവയുടെ വിവരങ്ങൾ നൽകുക.",
      ],
      [
        "മെഡിക്കൽ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക",
        "പ്രിസ്ക്രിപ്ഷനുകൾ, ലാബ് റിപ്പോർട്ടുകൾ അല്ലെങ്കിൽ ഡിസ്ചാർജ് സംഗ്രഹങ്ങൾ അപ്‌ലോഡ് ചെയ്യുക.",
      ],
      [
        "പരിശോധിച്ച് സമർപ്പിക്കുക",
        "കൺസൾട്ടേഷൻ റിപ്പോർട്ട് സൃഷ്ടിക്കുന്നതിന് മുമ്പ് വിവരങ്ങൾ പരിശോധിക്കുക.",
      ],
    ],
    step: "ഘട്ടം",
    of: "ൽ",
    previous: "മുമ്പത്തേത്",
    continue: "തുടരുക",
    backDashboard: "ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക",
    submit: "കൺസൾട്ടേഷൻ റിപ്പോർട്ട് സൃഷ്ടിക്കുക",
    generating: "റിപ്പോർട്ട് സൃഷ്ടിക്കുന്നു...",
    interviewError: "ദയവായി ആദ്യം രോഗിയുടെ അഭിമുഖം പൂർത്തിയാക്കുക.",
    reportError: "സെർവറിൽ നിന്ന് സാധുവായ റിപ്പോർട്ട് ലഭിച്ചില്ല.",
    submitError: "റിപ്പോർട്ട് സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",
  },

  pa: {
    steps: [
      [
        "ਤੁਸੀਂ ਇੱਥੇ ਕਿਉਂ ਆਏ ਹੋ?",
        "ਆਪਣੇ ਮੌਜੂਦਾ ਲੱਛਣਾਂ ਬਾਰੇ ਦੱਸੋ। AI ਸਹਾਇਕ ਸੰਬੰਧਿਤ ਸਵਾਲ ਪੁੱਛੇਗਾ।",
      ],
      [
        "ਤੁਹਾਡਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
        "ਪਿਛਲੀਆਂ ਬਿਮਾਰੀਆਂ, ਮੌਜੂਦਾ ਸਮੱਸਿਆਵਾਂ, ਐਲਰਜੀਆਂ ਅਤੇ ਦਵਾਈਆਂ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿਓ।",
      ],
      [
        "ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰੋ",
        "ਪ੍ਰਿਸਕ੍ਰਿਪਸ਼ਨ, ਲੈਬ ਰਿਪੋਰਟਾਂ ਜਾਂ ਡਿਸਚਾਰਜ ਸੰਖੇਪ ਅੱਪਲੋਡ ਕਰੋ।",
      ],
      [
        "ਜਾਂਚੋ ਅਤੇ ਜਮ੍ਹਾਂ ਕਰੋ",
        "ਰਿਪੋਰਟ ਬਣਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੀ ਜਾਣਕਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ।",
      ],
    ],
    step: "ਪੜਾਅ",
    of: "ਵਿੱਚੋਂ",
    previous: "ਪਿਛਲਾ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    backDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ ਜਾਓ",
    submit: "ਕੰਸਲਟੇਸ਼ਨ ਰਿਪੋਰਟ ਬਣਾਓ",
    generating: "ਰਿਪੋਰਟ ਬਣਾਈ ਜਾ ਰਹੀ ਹੈ...",
    interviewError: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਮਰੀਜ਼ ਦਾ ਇੰਟਰਵਿਊ ਪੂਰਾ ਕਰੋ।",
    reportError: "ਸਰਵਰ ਤੋਂ ਸਹੀ ਰਿਪੋਰਟ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋਈ।",
    submitError: "ਰਿਪੋਰਟ ਨਹੀਂ ਬਣ ਸਕੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  },
};

// These translations are only for the report header, token section
// and navigation surrounding the report.
const resultTranslations = {
  en: {
    reportTitle: "Patient Clinical Summary",
    reportGenerated: "Consultation report generated successfully",
    ready: "Ready for review",
    tokenTitle: "Your Report Access Token",
    tokenSubtitle: "Share this token with your doctor.",
    copy: "Copy Token",
    copied: "Copied!",
    tokenWarning:
      "Keep this token private and share it only with your authorized healthcare professional. Anyone who has the token may be able to request access to your report.",
    verify: "Please verify the information before clinical use.",
    backDashboard: "Back to Dashboard",
  },

  hi: {
    reportTitle: "मरीज का क्लिनिकल सारांश",
    reportGenerated: "परामर्श रिपोर्ट सफलतापूर्वक तैयार की गई",
    ready: "समीक्षा के लिए तैयार",
    tokenTitle: "आपका रिपोर्ट एक्सेस टोकन",
    tokenSubtitle: "यह टोकन अपने डॉक्टर के साथ साझा करें।",
    copy: "टोकन कॉपी करें",
    copied: "कॉपी हो गया!",
    tokenWarning:
      "इस टोकन को निजी रखें और केवल अपने अधिकृत स्वास्थ्य पेशेवर के साथ साझा करें।",
    verify: "क्लिनिकल उपयोग से पहले जानकारी की पुष्टि करें।",
    backDashboard: "डैशबोर्ड पर वापस जाएँ",
  },

  gu: {
    reportTitle: "દર્દીનો ક્લિનિકલ સારાંશ",
    reportGenerated: "કન્સલ્ટેશન રિપોર્ટ સફળતાપૂર્વક તૈયાર થયો",
    ready: "સમીક્ષા માટે તૈયાર",
    tokenTitle: "તમારો રિપોર્ટ એક્સેસ ટોકન",
    tokenSubtitle: "આ ટોકન તમારા ડૉક્ટર સાથે શેર કરો.",
    copy: "ટોકન કૉપી કરો",
    copied: "કૉપી થઈ ગયું!",
    tokenWarning:
      "આ ટોકન ખાનગી રાખો અને ફક્ત તમારા અધિકૃત આરોગ્ય નિષ્ણાત સાથે શેર કરો.",
    verify: "ક્લિનિકલ ઉપયોગ પહેલાં માહિતીની પુષ્ટિ કરો.",
    backDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
  },

  mr: {
    reportTitle: "रुग्णाचा क्लिनिकल सारांश",
    reportGenerated: "सल्लामसलत अहवाल यशस्वीरित्या तयार झाला",
    ready: "पुनरावलोकनासाठी तयार",
    tokenTitle: "तुमचा रिपोर्ट ॲक्सेस टोकन",
    tokenSubtitle: "हे टोकन तुमच्या डॉक्टरांसोबत शेअर करा.",
    copy: "टोकन कॉपी करा",
    copied: "कॉपी झाले!",
    tokenWarning:
      "हे टोकन गोपनीय ठेवा आणि फक्त अधिकृत आरोग्य व्यावसायिकांसोबत शेअर करा.",
    verify: "क्लिनिकल वापरापूर्वी माहितीची पडताळणी करा.",
    backDashboard: "डॅशबोर्डवर परत जा",
  },

  bn: {
    reportTitle: "রোগীর ক্লিনিক্যাল সারাংশ",
    reportGenerated: "পরামর্শের রিপোর্ট সফলভাবে তৈরি হয়েছে",
    ready: "পর্যালোচনার জন্য প্রস্তুত",
    tokenTitle: "আপনার রিপোর্ট অ্যাক্সেস টোকেন",
    tokenSubtitle: "এই টোকেনটি আপনার ডাক্তারের সাথে শেয়ার করুন।",
    copy: "টোকেন কপি করুন",
    copied: "কপি হয়েছে!",
    tokenWarning:
      "এই টোকেনটি গোপন রাখুন এবং শুধুমাত্র অনুমোদিত স্বাস্থ্যকর্মীর সাথে শেয়ার করুন।",
    verify: "ক্লিনিক্যাল ব্যবহারের আগে তথ্য যাচাই করুন।",
    backDashboard: "ড্যাশবোর্ডে ফিরে যান",
  },

  ta: {
    reportTitle: "நோயாளியின் மருத்துவ சுருக்கம்",
    reportGenerated: "ஆலோசனை அறிக்கை வெற்றிகரமாக உருவாக்கப்பட்டது",
    ready: "மதிப்பாய்வுக்குத் தயார்",
    tokenTitle: "உங்கள் அறிக்கை அணுகல் டோக்கன்",
    tokenSubtitle: "இந்த டோக்கனை உங்கள் மருத்துவருடன் பகிரவும்.",
    copy: "டோக்கனை நகலெடு",
    copied: "நகலெடுக்கப்பட்டது!",
    tokenWarning:
      "இந்த டோக்கனை ரகசியமாக வைத்திருந்து அங்கீகரிக்கப்பட்ட சுகாதார நிபுணருடன் மட்டுமே பகிரவும்.",
    verify: "மருத்துவப் பயன்பாட்டிற்கு முன் தகவலைச் சரிபார்க்கவும்.",
    backDashboard: "டாஷ்போர்டுக்குத் திரும்பு",
  },

  te: {
    reportTitle: "రోగి క్లినికల్ సారాంశం",
    reportGenerated: "కన్సల్టేషన్ నివేదిక విజయవంతంగా రూపొందించబడింది",
    ready: "సమీక్షకు సిద్ధంగా ఉంది",
    tokenTitle: "మీ నివేదిక యాక్సెస్ టోకెన్",
    tokenSubtitle: "ఈ టోకెన్‌ను మీ వైద్యుడితో పంచుకోండి.",
    copy: "టోకెన్ కాపీ చేయండి",
    copied: "కాపీ చేయబడింది!",
    tokenWarning:
      "ఈ టోకెన్‌ను రహస్యంగా ఉంచి, మీ అధీకృత ఆరోగ్య నిపుణులతో మాత్రమే పంచుకోండి.",
    verify: "వైద్యపరమైన ఉపయోగానికి ముందు సమాచారాన్ని ధృవీకరించండి.",
    backDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి",
  },

  kn: {
    reportTitle: "ರೋಗಿಯ ಕ್ಲಿನಿಕಲ್ ಸಾರಾಂಶ",
    reportGenerated: "ಸಮಾಲೋಚನಾ ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ",
    ready: "ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧವಾಗಿದೆ",
    tokenTitle: "ನಿಮ್ಮ ವರದಿ ಪ್ರವೇಶ ಟೋಕನ್",
    tokenSubtitle: "ಈ ಟೋಕನ್ ಅನ್ನು ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.",
    copy: "ಟೋಕನ್ ನಕಲಿಸಿ",
    copied: "ನಕಲಿಸಲಾಗಿದೆ!",
    tokenWarning:
      "ಈ ಟೋಕನ್ ಅನ್ನು ಖಾಸಗಿಯಾಗಿ ಇರಿಸಿ ಮತ್ತು ಅಧಿಕೃತ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರೊಂದಿಗೆ ಮಾತ್ರ ಹಂಚಿಕೊಳ್ಳಿ.",
    verify: "ವೈದ್ಯಕೀಯ ಬಳಕೆಗೆ ಮೊದಲು ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    backDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
  },

  ml: {
    reportTitle: "രോഗിയുടെ ക്ലിനിക്കൽ സംഗ്രഹം",
    reportGenerated: "കൺസൾട്ടേഷൻ റിപ്പോർട്ട് വിജയകരമായി സൃഷ്ടിച്ചു",
    ready: "പരിശോധനയ്ക്ക് തയ്യാറാണ്",
    tokenTitle: "നിങ്ങളുടെ റിപ്പോർട്ട് ആക്സസ് ടോക്കൺ",
    tokenSubtitle: "ഈ ടോക്കൺ നിങ്ങളുടെ ഡോക്ടറുമായി പങ്കിടുക.",
    copy: "ടോക്കൺ പകർത്തുക",
    copied: "പകർത്തി!",
    tokenWarning:
      "ഈ ടോക്കൺ രഹസ്യമായി സൂക്ഷിക്കുകയും അംഗീകൃത ആരോഗ്യ വിദഗ്ധരുമായി മാത്രം പങ്കിടുകയും ചെയ്യുക.",
    verify: "ക്ലിനിക്കൽ ഉപയോഗത്തിന് മുമ്പ് വിവരങ്ങൾ പരിശോധിക്കുക.",
    backDashboard: "ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക",
  },

  pa: {
    reportTitle: "ਮਰੀਜ਼ ਦਾ ਕਲੀਨਿਕਲ ਸਾਰ",
    reportGenerated: "ਕੰਸਲਟੇਸ਼ਨ ਰਿਪੋਰਟ ਸਫਲਤਾਪੂਰਵਕ ਤਿਆਰ ਹੋ ਗਈ",
    ready: "ਸਮੀਖਿਆ ਲਈ ਤਿਆਰ",
    tokenTitle: "ਤੁਹਾਡਾ ਰਿਪੋਰਟ ਐਕਸੈੱਸ ਟੋਕਨ",
    tokenSubtitle: "ਇਹ ਟੋਕਨ ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।",
    copy: "ਟੋਕਨ ਕਾਪੀ ਕਰੋ",
    copied: "ਕਾਪੀ ਹੋ ਗਿਆ!",
    tokenWarning:
      "ਇਸ ਟੋਕਨ ਨੂੰ ਨਿੱਜੀ ਰੱਖੋ ਅਤੇ ਸਿਰਫ਼ ਅਧਿਕਾਰਤ ਸਿਹਤ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।",
    verify: "ਕਲੀਨਿਕਲ ਵਰਤੋਂ ਤੋਂ ਪਹਿਲਾਂ ਜਾਣਕਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ।",
    backDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ ਜਾਓ",
  },
};

// All clinical report content is displayed in English.
const reportT = {
  reportError: "The server did not return a valid consultation report.",
  reportTitle: "Patient Clinical Summary",
  notProvided: "Not provided",
  notSpecified: "Not specified",
  chiefComplaint: "Chief Complaint",
  primaryReason: "Primary reason for consultation",
  duration: "Duration",
  severity: "Severity",
  symptoms: "Reported Symptoms",
  symptomsSubtitle: "Symptoms reported by the patient",
  clinicalValues: "Important Clinical Values",
  clinicalValuesSubtitle: "Values recorded during the consultation",
  parameter: "Parameter",
  value: "Value",
  source: "Source",
  noClinicalValues: "No additional clinical values provided.",
  history: "Medical History",
  historySubtitle: "Relevant pre-existing medical information",
  allergies: "Allergies",
  medications: "Current Medications",
  documentFindings: "Uploaded Document Findings",
  documentSubtitle:
    "Information extracted from patient-provided documents",
  document: "Document",
  reviewed: "Reviewed",
  noFindings: "No findings available.",
  noDocuments: "No documents were uploaded.",
  missing: "Missing Information / Needs Review",
  missingSubtitle:
    "Details not available in the submitted information",
  noMissing: "No additional missing information was identified.",
  doctorSummary: "Summary for Doctor Review",
  doctorSummarySubtitle:
    "Concise overview of the submitted patient information",
  summaryUnavailable: "Summary not available.",
  reportNote:
    "This report contains patient-provided information and extracted document details. It is intended for review by a qualified healthcare professional.",
};

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3F7] text-[#315B78]">
        <Icon size={18} />
      </div>

      <div>
        <h3 className="text-sm font-semibold tracking-wide text-[#243B53]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-0.5 text-xs text-[#718096]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyValue({ value, t }) {
  if (
    !value ||
    value === "Not provided" ||
    value === "Not available"
  ) {
    return (
      <span className="text-sm italic text-[#8995A3]">
        {t.notProvided}
      </span>
    );
  }

  return (
    <span className="text-sm text-[#334155]">
      {value}
    </span>
  );
}

function TagList({ items, emptyText }) {
  const validItems = Array.isArray(items)
    ? items.filter(
        (item) =>
          item &&
          typeof item === "string" &&
          item.trim()
      )
    : [];

  if (!validItems.length) {
    return (
      <p className="text-sm italic text-[#8995A3]">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {validItems.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-sm text-[#334155]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ClinicalReport({ report, t }) {
  if (typeof report === "string") {
    return (
      <div className="whitespace-pre-wrap rounded-xl border border-[#E2E8ED] bg-white p-5 text-sm leading-7 text-[#334155]">
        {report}
      </div>
    );
  }

  const data = report || {};
  const complaint = data.chiefComplaint || {};

  const documents = Array.isArray(data.documentFindings)
    ? data.documentFindings
    : [];

  const keyValues = Array.isArray(data.keyValues)
    ? data.keyValues
    : [];

  const missing = Array.isArray(data.missingInformation)
    ? data.missingInformation
    : [];

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-[#D8E3EC] bg-[#F5F8FB] p-5">
        <SectionHeading
          icon={Activity}
          title={t.chiefComplaint}
          subtitle={t.primaryReason}
        />

        <h2 className="text-xl font-semibold text-[#203B53]">
          {complaint.problem || t.notProvided}
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E1E8EF] bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#718096]">
              {t.duration}
            </p>

            <p className="mt-1 text-sm font-semibold text-[#334155]">
              <EmptyValue
                value={complaint.duration}
                t={t}
              />
            </p>
          </div>

          <div className="rounded-lg border border-[#E1E8EF] bg-white px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[#718096]">
              {t.severity}
            </p>

            <p className="mt-1 text-sm font-semibold text-[#334155]">
              <EmptyValue
                value={complaint.severity}
                t={t}
              />
            </p>
          </div>
        </div>
      </section>

      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={HeartPulse}
          title={t.symptoms}
          subtitle={t.symptomsSubtitle}
        />

        <TagList
          items={data.symptoms}
          emptyText={t.notProvided}
        />
      </section>

      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={Activity}
          title={t.clinicalValues}
          subtitle={t.clinicalValuesSubtitle}
        />

        {keyValues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#E8EDF1] text-xs uppercase tracking-wide text-[#718096]">
                  <th className="px-3 py-3 font-semibold">
                    {t.parameter}
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    {t.value}
                  </th>

                  <th className="px-3 py-3 font-semibold">
                    {t.source}
                  </th>
                </tr>
              </thead>

              <tbody>
                {keyValues.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#F0F2F5] last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-[#334155]">
                      {item.name || item.parameter || "—"}
                    </td>

                    <td className="px-3 py-3 font-semibold text-[#176B61]">
                      {item.value || "—"}
                      {item.unit ? ` ${item.unit}` : ""}
                    </td>

                    <td className="px-3 py-3 text-xs text-[#718096]">
                      {item.source || t.notSpecified}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm italic text-[#8995A3]">
            {t.noClinicalValues}
          </p>
        )}
      </section>

      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={ClipboardList}
          title={t.history}
          subtitle={t.historySubtitle}
        />

        <TagList
          items={data.medicalHistory}
          emptyText={t.notProvided}
        />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className={SECTION_STYLE}>
          <SectionHeading
            icon={ShieldAlert}
            title={t.allergies}
          />

          <TagList
            items={data.allergies}
            emptyText={t.notProvided}
          />
        </section>

        <section className={SECTION_STYLE}>
          <SectionHeading
            icon={Pill}
            title={t.medications}
          />

          <TagList
            items={data.medications}
            emptyText={t.notProvided}
          />
        </section>
      </div>

      <section className={SECTION_STYLE}>
        <SectionHeading
          icon={FileText}
          title={t.documentFindings}
          subtitle={t.documentSubtitle}
        />

        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((document, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#E4E9EE] bg-[#FAFBFC] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#334155]">
                    {document.name ||
                      `${t.document} ${index + 1}`}
                  </p>

                  <span className="rounded-md bg-[#F3F0E5] px-2.5 py-1 text-xs font-medium text-[#8A6A26]">
                    {document.status || t.reviewed}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  {document.finding || t.noFindings}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-[#8995A3]">
            {t.noDocuments}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[#EADFBF] bg-[#FFFCF4] p-5">
        <SectionHeading
          icon={AlertCircle}
          title={t.missing}
          subtitle={t.missingSubtitle}
        />

        {missing.length > 0 ? (
          <ul className="space-y-2">
            {missing.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-[#725B2B]"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B58A36]" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[#725B2B]">
            {t.noMissing}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-[#CFE0DA] bg-[#F4F8F6] p-5">
        <SectionHeading
          icon={Stethoscope}
          title={t.doctorSummary}
          subtitle={t.doctorSummarySubtitle}
        />

        <p className="text-sm leading-7 text-[#334E4A]">
          {data.doctorSummary || t.summaryUnavailable}
        </p>
      </section>

      <p className="px-1 text-xs leading-5 text-[#8995A3]">
        {t.reportNote}
      </p>
    </div>
  );
}

export default function NewConsultation() {
  const [step, setStep] = useState(0);
  const [interviewSummary, setInterviewSummary] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [medicalDocuments, setMedicalDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [finalReport, setFinalReport] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [copied, setCopied] = useState(false);

  const [language] = useState(() => {
    const savedLanguage =
      sessionStorage.getItem("medikioskLanguage") || "en";

    return savedLanguage.trim().toLowerCase();
  });

  // Selected language for the consultation form.
  const t = translations[language] || translations.en;

  // Selected language for the report header and token section.
  const resultT =
    resultTranslations[language] || resultTranslations.en;

  useEffect(() => {
    if (interviewSummary.trim()) {
      setStep(1);
    }
  }, [interviewSummary]);

  async function handleSubmit() {
    if (submitting) return;

    if (!interviewSummary.trim()) {
      setSubmitError(t.interviewError);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await submitConsultation({
        interviewSummary,
        medicalHistory,
        medicalDocuments,

        // Clinical report content must always be generated in English.
        language: "en",
      });

      console.log("Report API response:", result);

      const report =
        result?.finalReport ?? result?.data?.finalReport;

      if (
        !report ||
        (typeof report !== "string" &&
          typeof report !== "object")
      ) {
        throw new Error(reportT.reportError);
      }

      setFinalReport(report);

      setAccessToken(
        result?.accessToken ??
          result?.data?.accessToken ??
          ""
      );
    } catch (error) {
      console.error(
        "Consultation submission failed:",
        error
      );

      setSubmitError(error.message || t.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopyToken() {
    if (!accessToken) return;

    try {
      await navigator.clipboard.writeText(accessToken);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy access token:", error);
    }
  }

  const currentStep = t.steps[step];

  return (
    <div className="mx-auto w-full max-w-4xl">
      {finalReport ? (
        <section className="rounded-2xl border border-[#DCE4E9] bg-[#F8FAFB] p-5 sm:p-8">
          {/* Report header: selected language */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#E1E7EC] pb-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E8F0F2] text-[#315B78]">
                <MessageCircle size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-[#203B53] sm:text-2xl">
                  {resultT.reportTitle}
                </h1>

                <p className="mt-1 text-xs text-[#718096]">
                  {resultT.reportGenerated}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE7D7] bg-[#F0FAF3] px-3 py-1.5 text-xs font-semibold text-[#28734A]">
              <CheckCircle2 size={14} />
              {resultT.ready}
            </span>
          </div>

          {/* Clinical report content: English only */}
          <ClinicalReport
            report={finalReport}
            t={reportT}
          />

          {/* Access token section: selected language */}
          <div className="mt-6 rounded-xl border border-[#CFE0DA] bg-[#F4F8F6] p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
                <KeyRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-[#214D43]">
                  {resultT.tokenTitle}
                </h2>

                <p className="text-xs text-[#718096]">
                  {resultT.tokenSubtitle}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="min-w-0 flex-1 rounded-lg border border-[#DCE5DC] bg-white px-4 py-3">
                <p className="break-all text-lg font-bold tracking-widest text-[#315B78]">
                  {accessToken || "—"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyToken}
                disabled={!accessToken}
                className="rounded-lg bg-[#47796E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#315E54] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? resultT.copied : resultT.copy}
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#718096]">
              {resultT.tokenWarning}
            </p>
          </div>

          {/* Bottom navigation: selected language */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E7EC] pt-5">
            <p className="text-xs text-[#718096]">
              {resultT.verify}
            </p>

            <Link
              to="/patient/dashboard"
              className="inline-flex items-center rounded-lg bg-[#315B78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264A63]"
            >
              {resultT.backDashboard}
            </Link>
          </div>
        </section>
      ) : (
        <>
          <Link
            to="/patient/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#47796E] hover:underline"
          >
            <ArrowLeft size={17} />
            {t.backDashboard}
          </Link>

          <div className="rounded-2xl border border-[#E2E8ED] bg-white p-5 sm:p-8">
            <p className="text-sm font-semibold text-[#315B78]">
              {t.step} {step + 1} {t.of} {t.steps.length}
            </p>

            <div className="mt-3 flex gap-2">
              {t.steps.map((item, index) => (
                <div
                  key={index}
                  className={`h-1.5 flex-1 rounded-full ${
                    index <= step
                      ? "bg-[#315B78]"
                      : "bg-[#E5EAEF]"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F0F2] text-[#315B78]">
              <MessageCircle size={24} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#203B53]">
              {currentStep[0]}
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#718096]">
              {currentStep[1]}
            </p>

            {step === 0 && (
              <div className="mt-6 rounded-xl border border-[#E2E8ED] bg-[#FAFBFC] p-4 sm:p-5">
                <ConversationalInterview
                  language={language}
                  onComplete={setInterviewSummary}
                />
              </div>
            )}

            {step === 1 && (
              <MedicalHistory
                language={language}
                onComplete={setMedicalHistory}
              />
            )}

            {step === 2 && (
              <MedicalDocumentUpload
                language={language}
                files={medicalDocuments}
                onFilesChange={setMedicalDocuments}
              />
            )}

            {step === 3 && (
              <ConsultationReview
                language={language}
                interviewSummary={interviewSummary}
                medicalHistory={medicalHistory}
                medicalDocuments={medicalDocuments}
              />
            )}

            {submitError && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {submitError}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#EDF0F3] pt-5">
              <button
                type="button"
                disabled={step === 0 || submitting}
                onClick={() =>
                  setStep((current) => current - 1)
                }
                className="rounded-lg border border-[#DCE4E9] px-4 py-2.5 text-sm font-medium text-[#40566B] transition hover:bg-[#F5F7F9] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.previous}
              </button>

              {step < t.steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    setStep((current) => current + 1)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#315B78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264A63]"
                >
                  {t.continue}
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-lg bg-[#315B78] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#264A63] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? t.generating : t.submit}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
