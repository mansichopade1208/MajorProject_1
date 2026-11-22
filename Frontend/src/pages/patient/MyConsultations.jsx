
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  ClipboardList,
  AlertCircle,
  Activity,
  HeartPulse,
  Pill,
  ShieldAlert,
  Stethoscope,
  KeyRound,
  Copy,
  Check,
  FileCheck,
  Info,
} from "lucide-react";

import { getMyConsultations } from "../../../services/consultationService.js";

const localeMap = {
  en: "en-IN",
  hi: "hi-IN",
  gu: "gu-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
};

const translations = {
  en: {
    back: "Back to Dashboard",
    title: "My Consultations",
    description: "View your consultation reports and access tokens.",
    newConsultation: "New Consultation",
    loading: "Loading your consultations...",
    unableToLoad: "Unable to load consultations",
    tryAgain: "Try Again",
    noConsultations: "No consultations yet",
    noConsultationsDescription: "Your completed consultation reports will appear here.",
    startConsultation: "Start Consultation",
    totalConsultations: "Total consultations",
    reportGenerated: "Report Generated",
    patientSummary: "Patient Clinical Summary",
    reportGeneratedDescription: "Consultation report generated",
    consultation: "Consultation",
    aiSummary: "AI Summary",
    accessToken: "Report Access Token",
    shareToken: "Share this token with your doctor.",
    copied: "Copied",
    copyToken: "Copy Token",
    tokenUnavailable: "Token unavailable for this older consultation.",
    createdOn: "Created on",
    hideReport: "Hide Full Report",
    viewReport: "View Full Report",
    dateUnavailable: "Date unavailable",
    notProvided: "Not provided",
    notSpecified: "Not specified",
    noValues: "No additional clinical values provided.",
    noFindings: "No findings available.",
    noDocuments: "No documents were uploaded.",
    noMissing: "No additional missing information identified.",
    summaryUnavailable: "Summary not available.",
    noReport: "Report not available.",
    chiefComplaint: "Chief Complaint",
    primaryReason: "Primary reason for consultation",
    duration: "Duration",
    severity: "Severity",
    symptoms: "Reported Symptoms",
    symptomsSubtitle: "Symptoms reported by the patient",
    clinicalValues: "Important Clinical Values",
    clinicalValuesSubtitle: "Values identified during the consultation",
    parameter: "Parameter",
    value: "Value",
    source: "Source",
    medicalHistory: "Medical History",
    medicalHistorySubtitle: "Relevant past medical information",
    allergies: "Allergies",
    medications: "Current Medications",
    documentFindings: "Uploaded Document Findings",
    documentFindingsSubtitle: "Information extracted from uploaded documents",
    reviewed: "Reviewed",
    missingInformation: "Missing Information / Needs Review",
    missingSubtitle: "Important details not available in the submitted information",
    doctorSummary: "Summary for Doctor Review",
    doctorSummarySubtitle: "AI-generated overview of the submitted information",
    disclaimer: "This AI-generated report is intended to support clinical review. It is not a medical diagnosis or prescription.",
    copyError: "Could not copy the token. Please copy it manually.",
    loadError: "Unable to load consultations.",
  },

  hi: {
    back: "डैशबोर्ड पर वापस जाएँ",
    title: "मेरे परामर्श",
    description: "अपनी परामर्श रिपोर्ट और एक्सेस टोकन देखें।",
    newConsultation: "नया परामर्श",
    loading: "आपके परामर्श लोड हो रहे हैं...",
    unableToLoad: "परामर्श लोड नहीं हो सके",
    tryAgain: "पुनः प्रयास करें",
    noConsultations: "अभी तक कोई परामर्श नहीं",
    noConsultationsDescription: "आपकी पूरी की गई परामर्श रिपोर्ट यहाँ दिखाई देंगी।",
    startConsultation: "परामर्श शुरू करें",
    totalConsultations: "कुल परामर्श",
    reportGenerated: "रिपोर्ट तैयार",
    patientSummary: "रोगी का क्लिनिकल सारांश",
    reportGeneratedDescription: "परामर्श रिपोर्ट तैयार की गई",
    consultation: "परामर्श",
    aiSummary: "AI सारांश",
    accessToken: "रिपोर्ट एक्सेस टोकन",
    shareToken: "यह टोकन अपने डॉक्टर के साथ साझा करें।",
    copied: "कॉपी हो गया",
    copyToken: "टोकन कॉपी करें",
    tokenUnavailable: "इस पुराने परामर्श के लिए टोकन उपलब्ध नहीं है।",
    createdOn: "बनाया गया",
    hideReport: "पूरी रिपोर्ट छिपाएँ",
    viewReport: "पूरी रिपोर्ट देखें",
    dateUnavailable: "तारीख उपलब्ध नहीं",
    notProvided: "जानकारी उपलब्ध नहीं",
    notSpecified: "निर्दिष्ट नहीं",
    noValues: "कोई अतिरिक्त क्लिनिकल जानकारी उपलब्ध नहीं है।",
    noFindings: "कोई निष्कर्ष उपलब्ध नहीं है।",
    noDocuments: "कोई दस्तावेज़ अपलोड नहीं किया गया।",
    noMissing: "कोई अतिरिक्त अधूरी जानकारी नहीं मिली।",
    summaryUnavailable: "सारांश उपलब्ध नहीं है।",
    noReport: "रिपोर्ट उपलब्ध नहीं है।",
    chiefComplaint: "मुख्य शिकायत",
    primaryReason: "परामर्श का मुख्य कारण",
    duration: "अवधि",
    severity: "गंभीरता",
    symptoms: "बताए गए लक्षण",
    symptomsSubtitle: "रोगी द्वारा बताए गए लक्षण",
    clinicalValues: "महत्वपूर्ण क्लिनिकल मान",
    clinicalValuesSubtitle: "परामर्श के दौरान पहचाने गए मान",
    parameter: "पैरामीटर",
    value: "मान",
    source: "स्रोत",
    medicalHistory: "चिकित्सा इतिहास",
    medicalHistorySubtitle: "पिछली महत्वपूर्ण चिकित्सा जानकारी",
    allergies: "एलर्जी",
    medications: "वर्तमान दवाएँ",
    documentFindings: "अपलोड किए गए दस्तावेज़ों के निष्कर्ष",
    documentFindingsSubtitle: "अपलोड किए गए दस्तावेज़ों से प्राप्त जानकारी",
    reviewed: "समीक्षा की गई",
    missingInformation: "अधूरी जानकारी / समीक्षा आवश्यक",
    missingSubtitle: "दी गई जानकारी में उपलब्ध नहीं महत्वपूर्ण विवरण",
    doctorSummary: "डॉक्टर के लिए सारांश",
    doctorSummarySubtitle: "दी गई जानकारी का AI द्वारा तैयार किया गया सारांश",
    disclaimer: "यह AI द्वारा तैयार की गई रिपोर्ट क्लिनिकल समीक्षा में सहायता के लिए है। यह चिकित्सा निदान या प्रिस्क्रिप्शन नहीं है।",
    copyError: "टोकन कॉपी नहीं हो सका। कृपया इसे मैन्युअल रूप से कॉपी करें।",
    loadError: "परामर्श लोड नहीं हो सके।",
  },

  gu: {
    back: "ડેશબોર્ડ પર પાછા જાઓ",
    title: "મારા કન્સલ્ટેશન",
    description: "તમારા કન્સલ્ટેશન રિપોર્ટ અને એક્સેસ ટોકન જુઓ.",
    newConsultation: "નવું કન્સલ્ટેશન",
    loading: "તમારા કન્સલ્ટેશન લોડ થઈ રહ્યા છે...",
    unableToLoad: "કન્સલ્ટેશન લોડ થઈ શક્યા નથી",
    tryAgain: "ફરી પ્રયાસ કરો",
    noConsultations: "હજુ સુધી કોઈ કન્સલ્ટેશન નથી",
    noConsultationsDescription: "તમારા પૂર્ણ થયેલા કન્સલ્ટેશન રિપોર્ટ અહીં દેખાશે.",
    startConsultation: "કન્સલ્ટેશન શરૂ કરો",
    totalConsultations: "કુલ કન્સલ્ટેશન",
    reportGenerated: "રિપોર્ટ તૈયાર",
    patientSummary: "દર્દીનો ક્લિનિકલ સારાંશ",
    reportGeneratedDescription: "કન્સલ્ટેશન રિપોર્ટ તૈયાર થયો",
    consultation: "કન્સલ્ટેશન",
    aiSummary: "AI સારાંશ",
    accessToken: "રિપોર્ટ એક્સેસ ટોકન",
    shareToken: "આ ટોકન તમારા ડૉક્ટર સાથે શેર કરો.",
    copied: "કૉપી થયું",
    copyToken: "ટોકન કૉપી કરો",
    tokenUnavailable: "આ જૂના કન્સલ્ટેશન માટે ટોકન ઉપલબ્ધ નથી.",
    createdOn: "બનાવ્યું",
    hideReport: "સંપૂર્ણ રિપોર્ટ છુપાવો",
    viewReport: "સંપૂર્ણ રિપોર્ટ જુઓ",
    dateUnavailable: "તારીખ ઉપલબ્ધ નથી",
    notProvided: "આપવામાં આવ્યું નથી",
    notSpecified: "ઉલ્લેખિત નથી",
    noValues: "કોઈ વધારાના ક્લિનિકલ મૂલ્યો આપવામાં આવ્યા નથી.",
    noFindings: "કોઈ તારણો ઉપલબ્ધ નથી.",
    noDocuments: "કોઈ દસ્તાવેજ અપલોડ કરવામાં આવ્યો નથી.",
    noMissing: "કોઈ વધારાની અધૂરી માહિતી મળી નથી.",
    summaryUnavailable: "સારાંશ ઉપલબ્ધ નથી.",
    noReport: "રિપોર્ટ ઉપલબ્ધ નથી.",
    chiefComplaint: "મુખ્ય ફરિયાદ",
    primaryReason: "કન્સલ્ટેશનનું મુખ્ય કારણ",
    duration: "સમયગાળો",
    severity: "તીવ્રતા",
    symptoms: "જણાવેલા લક્ષણો",
    symptomsSubtitle: "દર્દી દ્વારા જણાવવામાં આવેલા લક્ષણો",
    clinicalValues: "મહત્વપૂર્ણ ક્લિનિકલ મૂલ્યો",
    clinicalValuesSubtitle: "કન્સલ્ટેશન દરમિયાન ઓળખાયેલા મૂલ્યો",
    parameter: "પેરામીટર",
    value: "મૂલ્ય",
    source: "સ્રોત",
    medicalHistory: "તબીબી ઇતિહાસ",
    medicalHistorySubtitle: "અગાઉની સંબંધિત તબીબી માહિતી",
    allergies: "એલર્જી",
    medications: "હાલની દવાઓ",
    documentFindings: "અપલોડ કરેલા દસ્તાવેજોના તારણો",
    documentFindingsSubtitle: "અપલોડ કરેલા દસ્તાવેજોમાંથી મેળવેલી માહિતી",
    reviewed: "સમીક્ષા કરેલ",
    missingInformation: "અધૂરી માહિતી / સમીક્ષા જરૂરી",
    missingSubtitle: "આપેલી માહિતીમાં ઉપલબ્ધ ન હોય તેવી મહત્વપૂર્ણ વિગતો",
    doctorSummary: "ડૉક્ટરની સમીક્ષા માટે સારાંશ",
    doctorSummarySubtitle: "આપેલી માહિતીનો AI દ્વારા તૈયાર કરેલો સારાંશ",
    disclaimer: "આ AI દ્વારા તૈયાર કરાયેલ રિપોર્ટ ક્લિનિકલ સમીક્ષામાં મદદ કરવા માટે છે. આ તબીબી નિદાન અથવા પ્રિસ્ક્રિપ્શન નથી.",
    copyError: "ટોકન કૉપી થઈ શક્યું નથી. કૃપા કરીને તેને મેન્યુઅલી કૉપી કરો.",
    loadError: "કન્સલ્ટેશન લોડ થઈ શક્યા નથી.",
  },

  mr: {
    back: "डॅशबोर्डवर परत जा",
    title: "माझे सल्लामसलत",
    description: "तुमचे सल्लामसलत अहवाल आणि ॲक्सेस टोकन पहा.",
    newConsultation: "नवीन सल्लामसलत",
    loading: "तुमचे सल्लामसलत अहवाल लोड होत आहेत...",
    unableToLoad: "सल्लामसलत अहवाल लोड करता आले नाहीत",
    tryAgain: "पुन्हा प्रयत्न करा",
    noConsultations: "अद्याप कोणतीही सल्लामसलत नाही",
    noConsultationsDescription: "तुमचे पूर्ण झालेले सल्लामसलत अहवाल येथे दिसतील.",
    startConsultation: "सल्लामसलत सुरू करा",
    totalConsultations: "एकूण सल्लामसलत",
    reportGenerated: "अहवाल तयार",
    patientSummary: "रुग्णाचा क्लिनिकल सारांश",
    reportGeneratedDescription: "सल्लामसलत अहवाल तयार केला",
    consultation: "सल्लामसलत",
    aiSummary: "AI सारांश",
    accessToken: "अहवाल ॲक्सेस टोकन",
    shareToken: "हे टोकन तुमच्या डॉक्टरांसोबत शेअर करा.",
    copied: "कॉपी झाले",
    copyToken: "टोकन कॉपी करा",
    tokenUnavailable: "या जुन्या सल्लामसलतीसाठी टोकन उपलब्ध नाही.",
    createdOn: "तयार केले",
    hideReport: "संपूर्ण अहवाल लपवा",
    viewReport: "संपूर्ण अहवाल पहा",
    dateUnavailable: "तारीख उपलब्ध नाही",
    notProvided: "दिलेली नाही",
    notSpecified: "नमूद केलेले नाही",
    noValues: "अतिरिक्त क्लिनिकल माहिती दिलेली नाही.",
    noFindings: "कोणतेही निष्कर्ष उपलब्ध नाहीत.",
    noDocuments: "कोणतेही दस्तऐवज अपलोड केलेले नाहीत.",
    noMissing: "अतिरिक्त अपूर्ण माहिती आढळली नाही.",
    summaryUnavailable: "सारांश उपलब्ध नाही.",
    noReport: "अहवाल उपलब्ध नाही.",
    chiefComplaint: "मुख्य तक्रार",
    primaryReason: "सल्लामसलतीचे मुख्य कारण",
    duration: "कालावधी",
    severity: "तीव्रता",
    symptoms: "सांगितलेली लक्षणे",
    symptomsSubtitle: "रुग्णाने सांगितलेली लक्षणे",
    clinicalValues: "महत्त्वाची क्लिनिकल मूल्ये",
    clinicalValuesSubtitle: "सल्लामसलतीदरम्यान ओळखलेली मूल्ये",
    parameter: "घटक",
    value: "मूल्य",
    source: "स्रोत",
    medicalHistory: "वैद्यकीय इतिहास",
    medicalHistorySubtitle: "पूर्वीची संबंधित वैद्यकीय माहिती",
    allergies: "ॲलर्जी",
    medications: "सध्याची औषधे",
    documentFindings: "अपलोड केलेल्या दस्तऐवजांचे निष्कर्ष",
    documentFindingsSubtitle: "अपलोड केलेल्या दस्तऐवजांमधून मिळालेली माहिती",
    reviewed: "पुनरावलोकन केले",
    missingInformation: "अपूर्ण माहिती / पुनरावलोकन आवश्यक",
    missingSubtitle: "दिलेल्या माहितीमध्ये उपलब्ध नसलेले महत्त्वाचे तपशील",
    doctorSummary: "डॉक्टरांच्या पुनरावलोकनासाठी सारांश",
    doctorSummarySubtitle: "दिलेल्या माहितीचा AI द्वारे तयार केलेला सारांश",
    disclaimer: "हा AI द्वारे तयार केलेला अहवाल वैद्यकीय पुनरावलोकनासाठी सहाय्यक आहे. हे वैद्यकीय निदान किंवा प्रिस्क्रिप्शन नाही.",
    copyError: "टोकन कॉपी करता आले नाही. कृपया ते स्वतः कॉपी करा.",
    loadError: "सल्लामसलत अहवाल लोड करता आले नाहीत.",
  },

  bn: {
    back: "ড্যাশবোর্ডে ফিরে যান",
    title: "আমার পরামর্শ",
    description: "আপনার পরামর্শের রিপোর্ট এবং অ্যাক্সেস টোকেন দেখুন।",
    newConsultation: "নতুন পরামর্শ",
    loading: "আপনার পরামর্শ লোড হচ্ছে...",
    unableToLoad: "পরামর্শ লোড করা যায়নি",
    tryAgain: "আবার চেষ্টা করুন",
    noConsultations: "এখনও কোনো পরামর্শ নেই",
    noConsultationsDescription: "আপনার সম্পূর্ণ করা পরামর্শের রিপোর্ট এখানে দেখা যাবে।",
    startConsultation: "পরামর্শ শুরু করুন",
    totalConsultations: "মোট পরামর্শ",
    reportGenerated: "রিপোর্ট তৈরি হয়েছে",
    patientSummary: "রোগীর ক্লিনিক্যাল সারাংশ",
    reportGeneratedDescription: "পরামর্শের রিপোর্ট তৈরি হয়েছে",
    consultation: "পরামর্শ",
    aiSummary: "AI সারাংশ",
    accessToken: "রিপোর্ট অ্যাক্সেস টোকেন",
    shareToken: "এই টোকেনটি আপনার ডাক্তারের সঙ্গে শেয়ার করুন।",
    copied: "কপি হয়েছে",
    copyToken: "টোকেন কপি করুন",
    tokenUnavailable: "এই পুরোনো পরামর্শের জন্য টোকেন উপলব্ধ নেই।",
    createdOn: "তৈরি হয়েছে",
    hideReport: "সম্পূর্ণ রিপোর্ট লুকান",
    viewReport: "সম্পূর্ণ রিপোর্ট দেখুন",
    dateUnavailable: "তারিখ উপলব্ধ নেই",
    notProvided: "দেওয়া হয়নি",
    notSpecified: "উল্লেখ করা হয়নি",
    noValues: "অতিরিক্ত কোনো ক্লিনিক্যাল তথ্য দেওয়া হয়নি।",
    noFindings: "কোনো ফলাফল উপলব্ধ নেই।",
    noDocuments: "কোনো নথি আপলোড করা হয়নি।",
    noMissing: "অতিরিক্ত কোনো অনুপস্থিত তথ্য পাওয়া যায়নি।",
    summaryUnavailable: "সারাংশ উপলব্ধ নেই।",
    noReport: "রিপোর্ট উপলব্ধ নেই।",
    chiefComplaint: "প্রধান সমস্যা",
    primaryReason: "পরামর্শের প্রধান কারণ",
    duration: "সময়কাল",
    severity: "তীব্রতা",
    symptoms: "জানানো উপসর্গ",
    symptomsSubtitle: "রোগীর জানানো উপসর্গ",
    clinicalValues: "গুরুত্বপূর্ণ ক্লিনিক্যাল মান",
    clinicalValuesSubtitle: "পরামর্শের সময় চিহ্নিত মান",
    parameter: "প্যারামিটার",
    value: "মান",
    source: "উৎস",
    medicalHistory: "চিকিৎসার ইতিহাস",
    medicalHistorySubtitle: "প্রাসঙ্গিক পূর্ববর্তী চিকিৎসার তথ্য",
    allergies: "অ্যালার্জি",
    medications: "বর্তমান ওষুধ",
    documentFindings: "আপলোড করা নথির ফলাফল",
    documentFindingsSubtitle: "আপলোড করা নথি থেকে পাওয়া তথ্য",
    reviewed: "পর্যালোচনা করা হয়েছে",
    missingInformation: "অনুপস্থিত তথ্য / পর্যালোচনা প্রয়োজন",
    missingSubtitle: "জমা দেওয়া তথ্যে অনুপস্থিত গুরুত্বপূর্ণ বিবরণ",
    doctorSummary: "ডাক্তারের পর্যালোচনার জন্য সারাংশ",
    doctorSummarySubtitle: "জমা দেওয়া তথ্যের AI-তৈরি সারাংশ",
    disclaimer: "এই AI-তৈরি রিপোর্ট চিকিৎসাগত পর্যালোচনায় সহায়তার জন্য। এটি কোনো চিকিৎসা নির্ণয় বা প্রেসক্রিপশন নয়।",
    copyError: "টোকেন কপি করা যায়নি। অনুগ্রহ করে নিজে কপি করুন।",
    loadError: "পরামর্শ লোড করা যায়নি।",
  },

  ta: {
    back: "டாஷ்போர்டுக்குத் திரும்பு",
    title: "எனது ஆலோசனைகள்",
    description: "உங்கள் ஆலோசனை அறிக்கைகள் மற்றும் அணுகல் டோக்கன்களைப் பார்க்கவும்.",
    newConsultation: "புதிய ஆலோசனை",
    loading: "உங்கள் ஆலோசனைகள் ஏற்றப்படுகின்றன...",
    unableToLoad: "ஆலோசனைகளை ஏற்ற முடியவில்லை",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    noConsultations: "இதுவரை ஆலோசனைகள் இல்லை",
    noConsultationsDescription: "நீங்கள் முடித்த ஆலோசனை அறிக்கைகள் இங்கே தோன்றும்.",
    startConsultation: "ஆலோசனையைத் தொடங்கவும்",
    totalConsultations: "மொத்த ஆலோசனைகள்",
    reportGenerated: "அறிக்கை உருவாக்கப்பட்டது",
    patientSummary: "நோயாளியின் மருத்துவச் சுருக்கம்",
    reportGeneratedDescription: "ஆலோசனை அறிக்கை உருவாக்கப்பட்டது",
    consultation: "ஆலோசனை",
    aiSummary: "AI சுருக்கம்",
    accessToken: "அறிக்கை அணுகல் டோக்கன்",
    shareToken: "இந்த டோக்கனை உங்கள் மருத்துவருடன் பகிரவும்.",
    copied: "நகலெடுக்கப்பட்டது",
    copyToken: "டோக்கனை நகலெடுக்கவும்",
    tokenUnavailable: "இந்த பழைய ஆலோசனைக்கு டோக்கன் கிடைக்கவில்லை.",
    createdOn: "உருவாக்கப்பட்டது",
    hideReport: "முழு அறிக்கையை மறைக்கவும்",
    viewReport: "முழு அறிக்கையைப் பார்க்கவும்",
    dateUnavailable: "தேதி கிடைக்கவில்லை",
    notProvided: "வழங்கப்படவில்லை",
    notSpecified: "குறிப்பிடப்படவில்லை",
    noValues: "கூடுதல் மருத்துவ மதிப்புகள் எதுவும் வழங்கப்படவில்லை.",
    noFindings: "கண்டறிதல்கள் எதுவும் கிடைக்கவில்லை.",
    noDocuments: "ஆவணங்கள் எதுவும் பதிவேற்றப்படவில்லை.",
    noMissing: "கூடுதல் விடுபட்ட தகவல்கள் எதுவும் கண்டறியப்படவில்லை.",
    summaryUnavailable: "சுருக்கம் கிடைக்கவில்லை.",
    noReport: "அறிக்கை கிடைக்கவில்லை.",
    chiefComplaint: "முக்கியப் புகார்",
    primaryReason: "ஆலோசனைக்கான முக்கியக் காரணம்",
    duration: "கால அளவு",
    severity: "தீவிரம்",
    symptoms: "தெரிவிக்கப்பட்ட அறிகுறிகள்",
    symptomsSubtitle: "நோயாளி தெரிவித்த அறிகுறிகள்",
    clinicalValues: "முக்கிய மருத்துவ மதிப்புகள்",
    clinicalValuesSubtitle: "ஆலோசனையின் போது கண்டறியப்பட்ட மதிப்புகள்",
    parameter: "அளவுரு",
    value: "மதிப்பு",
    source: "மூலம்",
    medicalHistory: "மருத்துவ வரலாறு",
    medicalHistorySubtitle: "தொடர்புடைய முந்தைய மருத்துவத் தகவல்கள்",
    allergies: "ஒவ்வாமைகள்",
    medications: "தற்போதைய மருந்துகள்",
    documentFindings: "பதிவேற்றிய ஆவணங்களின் கண்டறிதல்கள்",
    documentFindingsSubtitle: "பதிவேற்றிய ஆவணங்களிலிருந்து பெறப்பட்ட தகவல்கள்",
    reviewed: "மதிப்பாய்வு செய்யப்பட்டது",
    missingInformation: "விடுபட்ட தகவல்கள் / மதிப்பாய்வு தேவை",
    missingSubtitle: "சமர்ப்பிக்கப்பட்ட தகவலில் இல்லாத முக்கிய விவரங்கள்",
    doctorSummary: "மருத்துவர் மதிப்பாய்வுக்கான சுருக்கம்",
    doctorSummarySubtitle: "சமர்ப்பிக்கப்பட்ட தகவலின் AI உருவாக்கிய சுருக்கம்",
    disclaimer: "இந்த AI உருவாக்கிய அறிக்கை மருத்துவ மதிப்பாய்வுக்கு உதவுவதற்காக மட்டுமே. இது மருத்துவ நோயறிதல் அல்லது மருந்துச் சீட்டு அல்ல.",
    copyError: "டோக்கனை நகலெடுக்க முடியவில்லை. தயவுசெய்து கைமுறையாக நகலெடுக்கவும்.",
    loadError: "ஆலோசனைகளை ஏற்ற முடியவில்லை.",
  },

  te: {
    back: "డాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
    title: "నా సంప్రదింపులు",
    description: "మీ సంప్రదింపు నివేదికలు మరియు యాక్సెస్ టోకెన్‌లను చూడండి.",
    newConsultation: "కొత్త సంప్రదింపు",
    loading: "మీ సంప్రదింపులు లోడ్ అవుతున్నాయి...",
    unableToLoad: "సంప్రదింపులను లోడ్ చేయలేకపోయాము",
    tryAgain: "మళ్లీ ప్రయత్నించండి",
    noConsultations: "ఇంకా సంప్రదింపులు లేవు",
    noConsultationsDescription: "మీరు పూర్తి చేసిన సంప్రదింపు నివేదికలు ఇక్కడ కనిపిస్తాయి.",
    startConsultation: "సంప్రదింపును ప్రారంభించండి",
    totalConsultations: "మొత్తం సంప్రదింపులు",
    reportGenerated: "నివేదిక రూపొందించబడింది",
    patientSummary: "రోగి క్లినికల్ సారాంశం",
    reportGeneratedDescription: "సంప్రదింపు నివేదిక రూపొందించబడింది",
    consultation: "సంప్రదింపు",
    aiSummary: "AI సారాంశం",
    accessToken: "నివేదిక యాక్సెస్ టోకెన్",
    shareToken: "ఈ టోకెన్‌ను మీ వైద్యుడితో పంచుకోండి.",
    copied: "కాపీ చేయబడింది",
    copyToken: "టోకెన్‌ను కాపీ చేయండి",
    tokenUnavailable: "ఈ పాత సంప్రదింపుకు టోకెన్ అందుబాటులో లేదు.",
    createdOn: "సృష్టించిన తేదీ",
    hideReport: "పూర్తి నివేదికను దాచండి",
    viewReport: "పూర్తి నివేదికను చూడండి",
    dateUnavailable: "తేదీ అందుబాటులో లేదు",
    notProvided: "అందించబడలేదు",
    notSpecified: "పేర్కొనబడలేదు",
    noValues: "అదనపు క్లినికల్ విలువలు అందించబడలేదు.",
    noFindings: "ఫలితాలు అందుబాటులో లేవు.",
    noDocuments: "పత్రాలు ఏవీ అప్‌లోడ్ చేయబడలేదు.",
    noMissing: "అదనపు లోపించిన సమాచారం గుర్తించబడలేదు.",
    summaryUnavailable: "సారాంశం అందుబాటులో లేదు.",
    noReport: "నివేదిక అందుబాటులో లేదు.",
    chiefComplaint: "ప్రధాన ఫిర్యాదు",
    primaryReason: "సంప్రదింపుకు ప్రధాన కారణం",
    duration: "వ్యవధి",
    severity: "తీవ్రత",
    symptoms: "తెలిపిన లక్షణాలు",
    symptomsSubtitle: "రోగి తెలిపిన లక్షణాలు",
    clinicalValues: "ముఖ్యమైన క్లినికల్ విలువలు",
    clinicalValuesSubtitle: "సంప్రదింపు సమయంలో గుర్తించిన విలువలు",
    parameter: "పరామితి",
    value: "విలువ",
    source: "మూలం",
    medicalHistory: "వైద్య చరిత్ర",
    medicalHistorySubtitle: "సంబంధిత గత వైద్య సమాచారం",
    allergies: "అలర్జీలు",
    medications: "ప్రస్తుత మందులు",
    documentFindings: "అప్‌లోడ్ చేసిన పత్రాల ఫలితాలు",
    documentFindingsSubtitle: "అప్‌లోడ్ చేసిన పత్రాల నుండి పొందిన సమాచారం",
    reviewed: "సమీక్షించబడింది",
    missingInformation: "లోపించిన సమాచారం / సమీక్ష అవసరం",
    missingSubtitle: "సమర్పించిన సమాచారంలో లేని ముఖ్యమైన వివరాలు",
    doctorSummary: "వైద్యుని సమీక్ష కోసం సారాంశం",
    doctorSummarySubtitle: "సమర్పించిన సమాచారం ఆధారంగా AI రూపొందించిన సారాంశం",
    disclaimer: "ఈ AI రూపొందించిన నివేదిక వైద్య సమీక్షకు సహాయం చేయడానికి మాత్రమే. ఇది వైద్య నిర్ధారణ లేదా ప్రిస్క్రిప్షన్ కాదు.",
    copyError: "టోకెన్‌ను కాపీ చేయలేకపోయాము. దయచేసి మాన్యువల్‌గా కాపీ చేయండి.",
    loadError: "సంప్రదింపులను లోడ్ చేయలేకపోయాము.",
  },

  kn: {
    back: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    title: "ನನ್ನ ಸಮಾಲೋಚನೆಗಳು",
    description: "ನಿಮ್ಮ ಸಮಾಲೋಚನಾ ವರದಿಗಳು ಮತ್ತು ಪ್ರವೇಶ ಟೋಕನ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ.",
    newConsultation: "ಹೊಸ ಸಮಾಲೋಚನೆ",
    loading: "ನಿಮ್ಮ ಸಮಾಲೋಚನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    unableToLoad: "ಸಮಾಲೋಚನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",
    tryAgain: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    noConsultations: "ಇನ್ನೂ ಯಾವುದೇ ಸಮಾಲೋಚನೆಗಳಿಲ್ಲ",
    noConsultationsDescription: "ನೀವು ಪೂರ್ಣಗೊಳಿಸಿದ ಸಮಾಲೋಚನಾ ವರದಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.",
    startConsultation: "ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ",
    totalConsultations: "ಒಟ್ಟು ಸಮಾಲೋಚನೆಗಳು",
    reportGenerated: "ವರದಿ ಸಿದ್ಧವಾಗಿದೆ",
    patientSummary: "ರೋಗಿಯ ವೈದ್ಯಕೀಯ ಸಾರಾಂಶ",
    reportGeneratedDescription: "ಸಮಾಲೋಚನಾ ವರದಿ ರಚಿಸಲಾಗಿದೆ",
    consultation: "ಸಮಾಲೋಚನೆ",
    aiSummary: "AI ಸಾರಾಂಶ",
    accessToken: "ವರದಿ ಪ್ರವೇಶ ಟೋಕನ್",
    shareToken: "ಈ ಟೋಕನ್ ಅನ್ನು ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ.",
    copied: "ನಕಲಿಸಲಾಗಿದೆ",
    copyToken: "ಟೋಕನ್ ನಕಲಿಸಿ",
    tokenUnavailable: "ಈ ಹಳೆಯ ಸಮಾಲೋಚನೆಗೆ ಟೋಕನ್ ಲಭ್ಯವಿಲ್ಲ.",
    createdOn: "ರಚಿಸಿದ ದಿನಾಂಕ",
    hideReport: "ಪೂರ್ಣ ವರದಿಯನ್ನು ಮರೆಮಾಡಿ",
    viewReport: "ಪೂರ್ಣ ವರದಿಯನ್ನು ವೀಕ್ಷಿಸಿ",
    dateUnavailable: "ದಿನಾಂಕ ಲಭ್ಯವಿಲ್ಲ",
    notProvided: "ಒದಗಿಸಲಾಗಿಲ್ಲ",
    notSpecified: "ನಿರ್ದಿಷ್ಟಪಡಿಸಲಾಗಿಲ್ಲ",
    noValues: "ಹೆಚ್ಚುವರಿ ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಗಳನ್ನು ಒದಗಿಸಲಾಗಿಲ್ಲ.",
    noFindings: "ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಲಭ್ಯವಿಲ್ಲ.",
    noDocuments: "ಯಾವುದೇ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ.",
    noMissing: "ಹೆಚ್ಚುವರಿ ಕೊರತೆಯ ಮಾಹಿತಿ ಕಂಡುಬಂದಿಲ್ಲ.",
    summaryUnavailable: "ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ.",
    noReport: "ವರದಿ ಲಭ್ಯವಿಲ್ಲ.",
    chiefComplaint: "ಮುಖ್ಯ ದೂರು",
    primaryReason: "ಸಮಾಲೋಚನೆಯ ಮುಖ್ಯ ಕಾರಣ",
    duration: "ಅವಧಿ",
    severity: "ತೀವ್ರತೆ",
    symptoms: "ತಿಳಿಸಿದ ಲಕ್ಷಣಗಳು",
    symptomsSubtitle: "ರೋಗಿಯು ತಿಳಿಸಿದ ಲಕ್ಷಣಗಳು",
    clinicalValues: "ಪ್ರಮುಖ ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಗಳು",
    clinicalValuesSubtitle: "ಸಮಾಲೋಚನೆಯ ಸಮಯದಲ್ಲಿ ಗುರುತಿಸಿದ ಮೌಲ್ಯಗಳು",
    parameter: "ಪ್ಯಾರಾಮೀಟರ್",
    value: "ಮೌಲ್ಯ",
    source: "ಮೂಲ",
    medicalHistory: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    medicalHistorySubtitle: "ಸಂಬಂಧಿತ ಹಿಂದಿನ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿ",
    allergies: "ಅಲರ್ಜಿಗಳು",
    medications: "ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು",
    documentFindings: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳ ಫಲಿತಾಂಶಗಳು",
    documentFindingsSubtitle: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳಿಂದ ಪಡೆದ ಮಾಹಿತಿ",
    reviewed: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    missingInformation: "ಕಾಣೆಯಾದ ಮಾಹಿತಿ / ಪರಿಶೀಲನೆ ಅಗತ್ಯ",
    missingSubtitle: "ಸಲ್ಲಿಸಿದ ಮಾಹಿತಿಯಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲದ ಪ್ರಮುಖ ವಿವರಗಳು",
    doctorSummary: "ವೈದ್ಯರ ಪರಿಶೀಲನೆಗಾಗಿ ಸಾರಾಂಶ",
    doctorSummarySubtitle: "ಸಲ್ಲಿಸಿದ ಮಾಹಿತಿಯ AI ರಚಿತ ಸಾರಾಂಶ",
    disclaimer: "ಈ AI ರಚಿತ ವರದಿಯು ವೈದ್ಯಕೀಯ ಪರಿಶೀಲನೆಗೆ ಸಹಾಯ ಮಾಡಲು ಉದ್ದೇಶಿಸಲಾಗಿದೆ. ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯ ಅಥವಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಅಲ್ಲ.",
    copyError: "ಟೋಕನ್ ನಕಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಅದನ್ನು ಕೈಯಾರೆ ನಕಲಿಸಿ.",
    loadError: "ಸಮಾಲೋಚನೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
  },

  ml: {
    back: "ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക",
    title: "എന്റെ കൺസൾട്ടേഷനുകൾ",
    description: "നിങ്ങളുടെ കൺസൾട്ടേഷൻ റിപ്പോർട്ടുകളും ആക്സസ് ടോക്കണുകളും കാണുക.",
    newConsultation: "പുതിയ കൺസൾട്ടേഷൻ",
    loading: "നിങ്ങളുടെ കൺസൾട്ടേഷനുകൾ ലോഡ് ചെയ്യുന്നു...",
    unableToLoad: "കൺസൾട്ടേഷനുകൾ ലോഡ് ചെയ്യാനായില്ല",
    tryAgain: "വീണ്ടും ശ്രമിക്കുക",
    noConsultations: "ഇതുവരെ കൺസൾട്ടേഷനുകളൊന്നുമില്ല",
    noConsultationsDescription: "നിങ്ങൾ പൂർത്തിയാക്കിയ കൺസൾട്ടേഷൻ റിപ്പോർട്ടുകൾ ഇവിടെ കാണിക്കും.",
    startConsultation: "കൺസൾട്ടേഷൻ ആരംഭിക്കുക",
    totalConsultations: "ആകെ കൺസൾട്ടേഷനുകൾ",
    reportGenerated: "റിപ്പോർട്ട് തയ്യാറായി",
    patientSummary: "രോഗിയുടെ ക്ലിനിക്കൽ സംഗ്രഹം",
    reportGeneratedDescription: "കൺസൾട്ടേഷൻ റിപ്പോർട്ട് തയ്യാറാക്കി",
    consultation: "കൺസൾട്ടേഷൻ",
    aiSummary: "AI സംഗ്രഹം",
    accessToken: "റിപ്പോർട്ട് ആക്സസ് ടോക്കൺ",
    shareToken: "ഈ ടോക്കൺ നിങ്ങളുടെ ഡോക്ടറുമായി പങ്കിടുക.",
    copied: "പകർത്തി",
    copyToken: "ടോക്കൺ പകർത്തുക",
    tokenUnavailable: "ഈ പഴയ കൺസൾട്ടേഷന് ടോക്കൺ ലഭ്യമല്ല.",
    createdOn: "സൃഷ്ടിച്ചത്",
    hideReport: "മുഴുവൻ റിപ്പോർട്ടും മറയ്ക്കുക",
    viewReport: "മുഴുവൻ റിപ്പോർട്ടും കാണുക",
    dateUnavailable: "തീയതി ലഭ്യമല്ല",
    notProvided: "നൽകിയിട്ടില്ല",
    notSpecified: "വ്യക്തമാക്കിയിട്ടില്ല",
    noValues: "അധിക ക്ലിനിക്കൽ മൂല്യങ്ങളൊന്നും നൽകിയിട്ടില്ല.",
    noFindings: "കണ്ടെത്തലുകളൊന്നും ലഭ്യമല്ല.",
    noDocuments: "രേഖകളൊന്നും അപ്‌ലോഡ് ചെയ്തിട്ടില്ല.",
    noMissing: "കൂടുതൽ അപൂർണ്ണമായ വിവരങ്ങളൊന്നും കണ്ടെത്തിയില്ല.",
    summaryUnavailable: "സംഗ്രഹം ലഭ്യമല്ല.",
    noReport: "റിപ്പോർട്ട് ലഭ്യമല്ല.",
    chiefComplaint: "പ്രധാന പരാതി",
    primaryReason: "കൺസൾട്ടേഷന്റെ പ്രധാന കാരണം",
    duration: "ദൈർഘ്യം",
    severity: "തീവ്രത",
    symptoms: "റിപ്പോർട്ട് ചെയ്ത ലക്ഷണങ്ങൾ",
    symptomsSubtitle: "രോഗി അറിയിച്ച ലക്ഷണങ്ങൾ",
    clinicalValues: "പ്രധാന ക്ലിനിക്കൽ മൂല്യങ്ങൾ",
    clinicalValuesSubtitle: "കൺസൾട്ടേഷനിൽ തിരിച്ചറിഞ്ഞ മൂല്യങ്ങൾ",
    parameter: "പാരാമീറ്റർ",
    value: "മൂല്യം",
    source: "ഉറവിടം",
    medicalHistory: "മെഡിക്കൽ ചരിത്രം",
    medicalHistorySubtitle: "പ്രസക്തമായ മുൻകാല മെഡിക്കൽ വിവരങ്ങൾ",
    allergies: "അലർജികൾ",
    medications: "നിലവിലെ മരുന്നുകൾ",
    documentFindings: "അപ്‌ലോഡ് ചെയ്ത രേഖകളിലെ കണ്ടെത്തലുകൾ",
    documentFindingsSubtitle: "അപ്‌ലോഡ് ചെയ്ത രേഖകളിൽ നിന്ന് ലഭിച്ച വിവരങ്ങൾ",
    reviewed: "പരിശോധിച്ചു",
    missingInformation: "വിട്ടുപോയ വിവരങ്ങൾ / പരിശോധന ആവശ്യമാണ്",
    missingSubtitle: "സമർപ്പിച്ച വിവരങ്ങളിൽ ലഭ്യമല്ലാത്ത പ്രധാന വിശദാംശങ്ങൾ",
    doctorSummary: "ഡോക്ടറുടെ പരിശോധനയ്ക്കുള്ള സംഗ്രഹം",
    doctorSummarySubtitle: "സമർപ്പിച്ച വിവരങ്ങളുടെ AI സൃഷ്ടിച്ച സംഗ്രഹം",
    disclaimer: "ഈ AI സൃഷ്ടിച്ച റിപ്പോർട്ട് ക്ലിനിക്കൽ പരിശോധനയെ സഹായിക്കാൻ ഉദ്ദേശിച്ചുള്ളതാണ്. ഇത് ഒരു മെഡിക്കൽ രോഗനിർണയമോ മരുന്ന് കുറിപ്പടിയോ അല്ല.",
    copyError: "ടോക്കൺ പകർത്താൻ കഴിഞ്ഞില്ല. ദയവായി സ്വമേധയാ പകർത്തുക.",
    loadError: "കൺസൾട്ടേഷനുകൾ ലോഡ് ചെയ്യാനായില്ല.",
  },

  pa: {
    back: "ਡੈਸ਼ਬੋਰਡ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    title: "ਮੇਰੀਆਂ ਸਲਾਹਾਂ",
    description: "ਆਪਣੀਆਂ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਅਤੇ ਐਕਸੈੱਸ ਟੋਕਨ ਵੇਖੋ।",
    newConsultation: "ਨਵਾਂ ਸਲਾਹ-ਮਸ਼ਵਰਾ",
    loading: "ਤੁਹਾਡੇ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...",
    unableToLoad: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੇ",
    tryAgain: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    noConsultations: "ਹਾਲੇ ਕੋਈ ਸਲਾਹ-ਮਸ਼ਵਰਾ ਨਹੀਂ",
    noConsultationsDescription: "ਤੁਹਾਡੀਆਂ ਪੂਰੀਆਂ ਹੋਈਆਂ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੀਆਂ।",
    startConsultation: "ਸਲਾਹ-ਮਸ਼ਵਰਾ ਸ਼ੁਰੂ ਕਰੋ",
    totalConsultations: "ਕੁੱਲ ਸਲਾਹ-ਮਸ਼ਵਰੇ",
    reportGenerated: "ਰਿਪੋਰਟ ਤਿਆਰ ਹੋ ਗਈ",
    patientSummary: "ਮਰੀਜ਼ ਦਾ ਕਲੀਨਿਕਲ ਸਾਰ",
    reportGeneratedDescription: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੀ ਰਿਪੋਰਟ ਤਿਆਰ ਕੀਤੀ ਗਈ",
    consultation: "ਸਲਾਹ-ਮਸ਼ਵਰਾ",
    aiSummary: "AI ਸਾਰ",
    accessToken: "ਰਿਪੋਰਟ ਐਕਸੈੱਸ ਟੋਕਨ",
    shareToken: "ਇਹ ਟੋਕਨ ਆਪਣੇ ਡਾਕਟਰ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।",
    copied: "ਕਾਪੀ ਹੋ ਗਿਆ",
    copyToken: "ਟੋਕਨ ਕਾਪੀ ਕਰੋ",
    tokenUnavailable: "ਇਸ ਪੁਰਾਣੇ ਸਲਾਹ-ਮਸ਼ਵਰੇ ਲਈ ਟੋਕਨ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    createdOn: "ਬਣਾਇਆ ਗਿਆ",
    hideReport: "ਪੂਰੀ ਰਿਪੋਰਟ ਲੁਕਾਓ",
    viewReport: "ਪੂਰੀ ਰਿਪੋਰਟ ਵੇਖੋ",
    dateUnavailable: "ਤਾਰੀਖ ਉਪਲਬਧ ਨਹੀਂ",
    notProvided: "ਦਿੱਤਾ ਨਹੀਂ ਗਿਆ",
    notSpecified: "ਦੱਸਿਆ ਨਹੀਂ ਗਿਆ",
    noValues: "ਕੋਈ ਵਾਧੂ ਕਲੀਨਿਕਲ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।",
    noFindings: "ਕੋਈ ਨਤੀਜੇ ਉਪਲਬਧ ਨਹੀਂ ਹਨ।",
    noDocuments: "ਕੋਈ ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
    noMissing: "ਕੋਈ ਵਾਧੂ ਗੁੰਮ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ।",
    summaryUnavailable: "ਸਾਰ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    noReport: "ਰਿਪੋਰਟ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    chiefComplaint: "ਮੁੱਖ ਸ਼ਿਕਾਇਤ",
    primaryReason: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦਾ ਮੁੱਖ ਕਾਰਨ",
    duration: "ਮਿਆਦ",
    severity: "ਗੰਭੀਰਤਾ",
    symptoms: "ਦੱਸੇ ਗਏ ਲੱਛਣ",
    symptomsSubtitle: "ਮਰੀਜ਼ ਵੱਲੋਂ ਦੱਸੇ ਗਏ ਲੱਛਣ",
    clinicalValues: "ਮਹੱਤਵਪੂਰਨ ਕਲੀਨਿਕਲ ਮੁੱਲ",
    clinicalValuesSubtitle: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੌਰਾਨ ਪਛਾਣੇ ਗਏ ਮੁੱਲ",
    parameter: "ਪੈਰਾਮੀਟਰ",
    value: "ਮੁੱਲ",
    source: "ਸਰੋਤ",
    medicalHistory: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
    medicalHistorySubtitle: "ਸੰਬੰਧਿਤ ਪਿਛਲੀ ਮੈਡੀਕਲ ਜਾਣਕਾਰੀ",
    allergies: "ਐਲਰਜੀ",
    medications: "ਮੌਜੂਦਾ ਦਵਾਈਆਂ",
    documentFindings: "ਅੱਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਦੇ ਨਤੀਜੇ",
    documentFindingsSubtitle: "ਅੱਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਤੋਂ ਪ੍ਰਾਪਤ ਜਾਣਕਾਰੀ",
    reviewed: "ਸਮੀਖਿਆ ਕੀਤੀ ਗਈ",
    missingInformation: "ਗੁੰਮ ਜਾਣਕਾਰੀ / ਸਮੀਖਿਆ ਲੋੜੀਂਦੀ",
    missingSubtitle: "ਜਮ੍ਹਾਂ ਕੀਤੀ ਜਾਣਕਾਰੀ ਵਿੱਚ ਉਪਲਬਧ ਨਾ ਹੋਣ ਵਾਲੇ ਮਹੱਤਵਪੂਰਨ ਵੇਰਵੇ",
    doctorSummary: "ਡਾਕਟਰ ਦੀ ਸਮੀਖਿਆ ਲਈ ਸਾਰ",
    doctorSummarySubtitle: "ਜਮ੍ਹਾਂ ਕੀਤੀ ਜਾਣਕਾਰੀ ਦਾ AI ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਸਾਰ",
    disclaimer: "ਇਹ AI ਦੁਆਰਾ ਤਿਆਰ ਕੀਤੀ ਰਿਪੋਰਟ ਕਲੀਨਿਕਲ ਸਮੀਖਿਆ ਵਿੱਚ ਮਦਦ ਲਈ ਹੈ। ਇਹ ਮੈਡੀਕਲ ਨਿਦਾਨ ਜਾਂ ਨੁਸਖ਼ਾ ਨਹੀਂ ਹੈ।",
    copyError: "ਟੋਕਨ ਕਾਪੀ ਨਹੀਂ ਹੋ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਖੁਦ ਕਾਪੀ ਕਰੋ।",
    loadError: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੇ।",
  },
};

function formatDate(date, language) {
  if (!date) {
    return translations[language]?.dateUnavailable ||
      translations.en.dateUnavailable;
  }

  return new Date(date).toLocaleDateString(
    localeMap[language] || "en-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function SectionHeading({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
        <Icon size={18} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#214D43]">{title}</h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function TagList({ items, emptyText = "Not provided" }) {
  const validItems = Array.isArray(items)
    ? items.filter(
        (item) => typeof item === "string" && item.trim()
      )
    : [];

  if (!validItems.length) {
    return <p className="text-sm italic text-gray-400">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {validItems.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="rounded-lg border border-[#DCE7DF] bg-[#F5F8F5] px-3 py-2 text-sm text-[#405B50]"
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
      <div className="whitespace-pre-wrap rounded-xl bg-white p-5 text-sm leading-7 text-gray-700">
        {report}
      </div>
    );
  }

  const data = report || {};
  const complaint = data.chiefComplaint || {};
  const keyValues = Array.isArray(data.keyValues) ? data.keyValues : [];
  const documents = Array.isArray(data.documentFindings)
    ? data.documentFindings
    : [];
  const missing = Array.isArray(data.missingInformation)
    ? data.missingInformation
    : [];

  return (
    <div className="space-y-4">
      {/* Chief complaint */}
      <section className="rounded-xl border border-[#DCE7DF] bg-white p-5">
        <SectionHeading
          icon={Activity}
          title={t.chiefComplaint}
          subtitle={t.primaryReason}
        />

        <h3 className="text-lg font-semibold text-[#214D43]">
          {complaint.problem || t.notProvided}
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-[#F5F8F5] p-3">
            <p className="text-xs text-gray-500">{t.duration}</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {complaint.duration || t.notProvided}
            </p>
          </div>

          <div className="rounded-lg bg-[#F5F8F5] p-3">
            <p className="text-xs text-gray-500">{t.severity}</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">
              {complaint.severity || t.notProvided}
            </p>
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={HeartPulse}
          title={t.symptoms}
          subtitle={t.symptomsSubtitle}
        />
        <TagList items={data.symptoms} emptyText={t.notProvided} />
      </section>

      {/* Key clinical values */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={Activity}
          title={t.clinicalValues}
          subtitle={t.clinicalValuesSubtitle}
        />

        {keyValues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-3 py-3 font-semibold">{t.parameter}</th>
                  <th className="px-3 py-3 font-semibold">{t.value}</th>
                  <th className="px-3 py-3 font-semibold">{t.source}</th>
                </tr>
              </thead>

              <tbody>
                {keyValues.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-3 py-3 font-medium text-gray-700">
                      {item?.label || "—"}
                    </td>
                    <td className="px-3 py-3 font-semibold text-[#326F61]">
                      {item?.value || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">
                      {item?.source || t.notSpecified}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">{t.noValues}</p>
        )}
      </section>

      {/* Medical history */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={ClipboardList}
          title={t.medicalHistory}
          subtitle={t.medicalHistorySubtitle}
        />
        <TagList items={data.medicalHistory} emptyText={t.notProvided} />
      </section>

      {/* Allergies and medications */}
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
          <SectionHeading icon={ShieldAlert} title={t.allergies} />
          <TagList items={data.allergies} emptyText={t.notProvided} />
        </section>

        <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
          <SectionHeading icon={Pill} title={t.medications} />
          <TagList items={data.medications} emptyText={t.notProvided} />
        </section>
      </div>

      {/* Document findings */}
      <section className="rounded-xl border border-[#E2E8E2] bg-white p-5">
        <SectionHeading
          icon={FileCheck}
          title={t.documentFindings}
          subtitle={t.documentFindingsSubtitle}
        />

        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((document, index) => (
              <div
                key={index}
                className="rounded-lg border border-[#E7ECE7] bg-[#F8FAF8] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#214D43]">
                    {document?.name || `Document ${index + 1}`}
                  </p>

                  <span className="rounded-full bg-[#E0EEE7] px-3 py-1 text-xs font-medium text-[#47796E]">
                    {document?.status || t.reviewed}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {document?.finding || t.noFindings}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-gray-400">{t.noDocuments}</p>
        )}
      </section>

      {/* Missing information */}
      <section className="rounded-xl border border-[#EADFBF] bg-[#FFFCF4] p-5">
        <SectionHeading
          icon={Info}
          title={t.missingInformation}
          subtitle={t.missingSubtitle}
        />

        <TagList items={missing} emptyText={t.noMissing} />
      </section>

      {/* Doctor summary */}
      <section className="rounded-xl border border-[#CFE0DA] bg-[#F0F7F2] p-5">
        <SectionHeading
          icon={Stethoscope}
          title={t.doctorSummary}
          subtitle={t.doctorSummarySubtitle}
        />

        <p className="text-sm leading-7 text-[#405B50]">
          {data.doctorSummary || t.summaryUnavailable}
        </p>
      </section>

      <p className="px-1 text-xs leading-5 text-gray-400">
        {t.disclaimer}
      </p>
    </div>
  );
}

export default function MyConsultations() {
  const [language] = useState(() => {
    const storedLanguage =
      sessionStorage.getItem("medikioskLanguage") || "en";

    return storedLanguage.trim().toLowerCase();
  });

  const t = translations[language] || translations.en;

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  async function fetchConsultations() {
    try {
      setLoading(true);
      setError("");

      const data = await getMyConsultations();
      setConsultations(data);
    } catch (err) {
      console.error("Consultations loading error:", err);
      setError(err.message || t.loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConsultations();
  }, []);

  async function copyToken(token, id) {
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);
      setCopiedId(id);

      setTimeout(() => {
        setCopiedId((current) => (current === id ? null : current));
      }, 2000);
    } catch {
      setError(t.copyError);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/patient/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#47796E] hover:underline"
      >
        <ArrowLeft size={17} />
        {t.back}
      </Link>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
            <ClipboardList size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#214D43]">
              {t.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t.description}
            </p>
          </div>
        </div>

        <Link
          to="/patient/consultation/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50]"
        >
          <Plus size={18} />
          {t.newConsultation}
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border border-[#E7E7DF] bg-white px-6 py-16 text-center">
          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-[#47796E]"
          />
          <p className="mt-4 text-sm font-medium text-[#315F53]">
            {t.loading}
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center">
          <AlertCircle size={35} className="mx-auto text-red-500" />
          <h3 className="mt-4 font-semibold text-[#214D43]">
            {t.unableToLoad}
          </h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={fetchConsultations}
            className="mt-5 rounded-lg bg-[#326F61] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {t.tryAgain}
          </button>
        </div>
      )}

      {!loading && !error && consultations.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#CADBD0] bg-white px-6 py-16 text-center">
          <FileText size={35} className="mx-auto text-[#47796E]" />
          <h3 className="mt-5 text-lg font-bold text-[#214D43]">
            {t.noConsultations}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {t.noConsultationsDescription}
          </p>
          <Link
            to="/patient/consultation/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-6 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            {t.startConsultation}
          </Link>
        </div>
      )}

      {!loading && !error && consultations.length > 0 && (
        <>
          <div className="mb-5 rounded-xl border border-[#DCE7DF] bg-[#F4F8F6] p-4">
            <p className="text-sm text-gray-500">{t.totalConsultations}</p>
            <p className="mt-1 text-2xl font-bold text-[#214D43]">
              {consultations.length}
            </p>
          </div>

          <div className="space-y-5">
            {consultations.map((consultation, index) => {
              const report = consultation.finalReport || {};
              const isExpanded = expandedId === consultation._id;
              const copied = copiedId === consultation._id;

              return (
                <article
                  key={consultation._id}
                  className="overflow-hidden rounded-2xl border border-[#E2E8E2] bg-white shadow-sm"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0EEE7] text-[#47796E]">
                          <FileText size={22} />
                        </div>

                        <div>
                          <h2 className="font-bold text-[#214D43]">
                            {report.title || t.patientSummary}
                          </h2>

                          <p className="mt-1 text-sm text-gray-600">
                            {report.chiefComplaint?.problem ||
                              t.reportGeneratedDescription}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <CalendarDays size={14} />
                            {formatDate(consultation.createdAt, language)}
                            <span>•</span>
                            {t.consultation} #{consultations.length - index}
                          </div>
                        </div>
                      </div>

                      <span className="rounded-full border border-[#CDE7D7] bg-[#F0FAF3] px-3 py-1.5 text-xs font-semibold text-[#28734A]">
                        {t.reportGenerated}
                      </span>
                    </div>

                    {report.doctorSummary && (
                      <div className="mt-4 rounded-xl bg-[#F4F8F6] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#47796E]">
                          {t.aiSummary}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {report.doctorSummary}
                        </p>
                      </div>
                    )}

                    {/* Access token shown with this report */}
                    <div className="mt-4 rounded-xl border border-[#CFE0DA] bg-[#F4F8F6] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <KeyRound size={19} className="text-[#47796E]" />
                          <div>
                            <h3 className="text-sm font-semibold text-[#214D43]">
                              {t.accessToken}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {t.shareToken}
                            </p>
                          </div>
                        </div>

                        {consultation.accessToken && (
                          <button
                            type="button"
                            onClick={() =>
                              copyToken(
                                consultation.accessToken,
                                consultation._id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-[#326F61] px-4 py-2 text-xs font-semibold text-white hover:bg-[#285C50]"
                          >
                            {copied ? <Check size={15} /> : <Copy size={15} />}
                            {copied ? t.copied : t.copyToken}
                          </button>
                        )}
                      </div>

                      {consultation.accessToken ? (
                        <p className="mt-3 break-all rounded-lg border border-[#DCE5DC] bg-white px-4 py-3 font-mono text-base font-bold tracking-widest text-[#214D43]">
                          {consultation.accessToken}
                        </p>
                      ) : (
                        <p className="mt-3 text-xs text-gray-500">
                          {t.tokenUnavailable}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF0EA] pt-4">
                      <p className="text-xs text-gray-400">
                        {t.createdOn} {formatDate(consultation.createdAt, language)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(
                            isExpanded ? null : consultation._id
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#E0EEE7] px-4 py-2.5 text-sm font-semibold text-[#315F53] hover:bg-[#D3E6DA]"
                      >
                        {isExpanded ? t.hideReport : t.viewReport}
                        {isExpanded ? (
                          <ChevronUp size={17} />
                        ) : (
                          <ChevronDown size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#E2E8E2] bg-[#F8FAF6] p-5 sm:p-6">
                      <h3 className="mb-4 text-lg font-bold text-[#214D43]">
                        {report.title || t.patientSummary}
                      </h3>
                      <ClinicalReport report={report} t={t} />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
