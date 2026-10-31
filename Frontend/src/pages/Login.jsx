
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import MediKioskHeader from "../components/MediKioskHeader.jsx";

const inputClass =
  "w-full rounded-xl border border-[#DCE5DC] bg-white px-4 py-3.5 text-sm text-[#214A43] outline-none transition placeholder:text-[#9AAEA5] focus:border-[#47796F] focus:ring-4 focus:ring-[#47796F]/10";

const translations = {
  en: {
    welcome: "Welcome back",
    title: "Your health, your journey.",
    description:
      "Your healthcare journey starts here. Sign in to access your personalized MediKiosk experience, whether you are a patient or a healthcare professional.",
    benefits: [
      "Simple and easy to use",
      "Your healthcare information in one place",
      "A smoother consultation experience",
    ],
    care: "Your care matters",
    security:
      "Sign in with the email and password linked to your registered account.",
    account: "Your account",
    signIn: "Sign in",
    formDescription: "Welcome back! Enter your details to continue.",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    signingIn: "Signing in...",
    noAccount: "Don't have an account?",
    createAccount: "Create account",
    footer: "Your health, our priority.",
    invalid: "Invalid email or password.",
    server: "Cannot connect to the server. Please check your backend.",
    roleError: "Unable to identify your account role.",
    invalidRole: "Invalid account role.",
    error: "Something went wrong. Please try again.",
  },

  hi: {
    welcome: "वापसी पर स्वागत है",
    title: "आपका स्वास्थ्य, आपका सफर।",
    description:
      "आपके स्वास्थ्य की देखभाल का सफर यहाँ से शुरू होता है। अपने MediKiosk खाते में प्रवेश करें।",
    benefits: [
      "सरल और उपयोग में आसान",
      "आपकी स्वास्थ्य जानकारी एक जगह",
      "डॉक्टर से बेहतर परामर्श",
    ],
    care: "आपकी देखभाल हमारे लिए महत्वपूर्ण है",
    security: "अपने पंजीकृत खाते के ईमेल और पासवर्ड से प्रवेश करें।",
    account: "आपका खाता",
    signIn: "लॉग इन करें",
    formDescription: "जारी रखने के लिए अपनी जानकारी भरें।",
    email: "ईमेल पता",
    emailPlaceholder: "you@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
    showPassword: "पासवर्ड दिखाएँ",
    hidePassword: "पासवर्ड छिपाएँ",
    signingIn: "लॉग इन हो रहा है...",
    noAccount: "खाता नहीं है?",
    createAccount: "खाता बनाएँ",
    footer: "आपका स्वास्थ्य, हमारी प्राथमिकता।",
    invalid: "ईमेल या पासवर्ड गलत है।",
    server: "सर्वर से कनेक्ट नहीं हो पा रहा है।",
    roleError: "आपके खाते की भूमिका पता नहीं चल सकी।",
    invalidRole: "खाते की भूमिका गलत है।",
    error: "कुछ गलत हुआ। कृपया फिर से कोशिश करें।",
  },

  bn: {
    welcome: "আবার স্বাগতম",
    title: "আপনার স্বাস্থ্য, আপনার যাত্রা।",
    description: "আপনার স্বাস্থ্যসেবার যাত্রা এখান থেকেই শুরু। আপনার MediKiosk অ্যাকাউন্টে প্রবেশ করুন।",
    benefits: ["সহজে ব্যবহার করুন", "স্বাস্থ্যের তথ্য এক জায়গায়", "আরও সহজ চিকিৎসা পরামর্শ"],
    care: "আপনার যত্ন গুরুত্বপূর্ণ",
    security: "আপনার নিবন্ধিত অ্যাকাউন্টের ইমেল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।",
    account: "আপনার অ্যাকাউন্ট",
    signIn: "সাইন ইন",
    formDescription: "চালিয়ে যেতে আপনার তথ্য দিন।",
    email: "ইমেল ঠিকানা",
    emailPlaceholder: "you@example.com",
    password: "পাসওয়ার্ড",
    passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
    showPassword: "পাসওয়ার্ড দেখান",
    hidePassword: "পাসওয়ার্ড লুকান",
    signingIn: "সাইন ইন হচ্ছে...",
    noAccount: "অ্যাকাউন্ট নেই?",
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    footer: "আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার।",
    invalid: "ইমেল বা পাসওয়ার্ড ভুল।",
    server: "সার্ভারের সঙ্গে সংযোগ করা যাচ্ছে না।",
    roleError: "আপনার অ্যাকাউন্টের ধরন শনাক্ত করা যায়নি।",
    invalidRole: "অ্যাকাউন্টের ধরন ভুল।",
    error: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
  },

  mr: {
    welcome: "पुन्हा स्वागत आहे",
    title: "तुमचे आरोग्य, तुमचा प्रवास.",
    description: "तुमच्या आरोग्यसेवेचा प्रवास इथून सुरू होतो. तुमच्या MediKiosk खात्यात प्रवेश करा.",
    benefits: ["वापरण्यास सोपे", "आरोग्याची माहिती एकाच ठिकाणी", "अधिक सोपा वैद्यकीय सल्ला"],
    care: "तुमची काळजी महत्त्वाची आहे",
    security: "तुमच्या नोंदणीकृत खात्याचा ईमेल आणि पासवर्ड वापरा.",
    account: "तुमचे खाते",
    signIn: "लॉग इन करा",
    formDescription: "पुढे जाण्यासाठी तुमची माहिती भरा.",
    email: "ईमेल पत्ता",
    emailPlaceholder: "you@example.com",
    password: "पासवर्ड",
    passwordPlaceholder: "पासवर्ड टाका",
    showPassword: "पासवर्ड दाखवा",
    hidePassword: "पासवर्ड लपवा",
    signingIn: "लॉग इन होत आहे...",
    noAccount: "खाते नाही?",
    createAccount: "खाते तयार करा",
    footer: "तुमचे आरोग्य, आमचे प्राधान्य.",
    invalid: "ईमेल किंवा पासवर्ड चुकीचा आहे.",
    server: "सर्व्हरशी जोडता येत नाही.",
    roleError: "खात्याचा प्रकार ओळखता आला नाही.",
    invalidRole: "खात्याचा प्रकार चुकीचा आहे.",
    error: "काहीतरी चुकले. पुन्हा प्रयत्न करा.",
  },

  te: {
    welcome: "మళ్లీ స్వాగతం",
    title: "మీ ఆరోగ్యం, మీ ప్రయాణం.",
    description: "మీ ఆరోగ్య సంరక్షణ ప్రయాణం ఇక్కడ ప్రారంభమవుతుంది. మీ MediKiosk ఖాతాలోకి ప్రవేశించండి.",
    benefits: ["ఉపయోగించడానికి సులభం", "ఆరోగ్య సమాచారం ఒకే చోట", "మెరుగైన వైద్య సంప్రదింపులు"],
    care: "మీ ఆరోగ్యం ముఖ్యం",
    security: "మీ నమోదిత ఖాతా ఇమెయిల్, పాస్‌వర్డ్‌తో ప్రవేశించండి.",
    account: "మీ ఖాతా",
    signIn: "లాగిన్ చేయండి",
    formDescription: "కొనసాగించడానికి మీ వివరాలను నమోదు చేయండి.",
    email: "ఇమెయిల్ చిరునామా",
    emailPlaceholder: "you@example.com",
    password: "పాస్‌వర్డ్",
    passwordPlaceholder: "మీ పాస్‌వర్డ్ నమోదు చేయండి",
    showPassword: "పాస్‌వర్డ్ చూపించు",
    hidePassword: "పాస్‌వర్డ్ దాచు",
    signingIn: "లాగిన్ అవుతోంది...",
    noAccount: "ఖాతా లేదా?",
    createAccount: "ఖాతా సృష్టించండి",
    footer: "మీ ఆరోగ్యం, మా ప్రాధాన్యత.",
    invalid: "ఇమెయిల్ లేదా పాస్‌వర్డ్ తప్పు.",
    server: "సర్వర్‌కు కనెక్ట్ కాలేకపోయింది.",
    roleError: "మీ ఖాతా రకాన్ని గుర్తించలేకపోయాం.",
    invalidRole: "ఖాతా రకం తప్పు.",
    error: "ఏదో తప్పు జరిగింది. మళ్లీ ప్రయత్నించండి.",
  },

  ta: {
    welcome: "மீண்டும் வரவேற்கிறோம்",
    title: "உங்கள் ஆரோக்கியம், உங்கள் பயணம்.",
    description: "உங்கள் சுகாதாரப் பயணம் இங்கே தொடங்குகிறது. உங்கள் MediKiosk கணக்கில் உள்நுழையுங்கள்.",
    benefits: ["பயன்படுத்த எளிதானது", "உங்கள் மருத்துவத் தகவல்கள் ஒரே இடத்தில்", "சிறந்த மருத்துவ ஆலோசனை"],
    care: "உங்கள் நலன் முக்கியம்",
    security: "உங்கள் பதிவு செய்யப்பட்ட கணக்கின் மின்னஞ்சல் மற்றும் கடவுச்சொல்லைப் பயன்படுத்துங்கள்.",
    account: "உங்கள் கணக்கு",
    signIn: "உள்நுழைக",
    formDescription: "தொடர உங்கள் விவரங்களை உள்ளிடுங்கள்.",
    email: "மின்னஞ்சல் முகவரி",
    emailPlaceholder: "you@example.com",
    password: "கடவுச்சொல்",
    passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடுங்கள்",
    showPassword: "கடவுச்சொல்லைக் காட்டு",
    hidePassword: "கடவுச்சொல்லை மறை",
    signingIn: "உள்நுழைகிறது...",
    noAccount: "கணக்கு இல்லையா?",
    createAccount: "கணக்கை உருவாக்கு",
    footer: "உங்கள் ஆரோக்கியம், எங்கள் முன்னுரிமை.",
    invalid: "மின்னஞ்சல் அல்லது கடவுச்சொல் தவறு.",
    server: "சேவையகத்துடன் இணைக்க முடியவில்லை.",
    roleError: "கணக்கு வகையை அடையாளம் காண முடியவில்லை.",
    invalidRole: "தவறான கணக்கு வகை.",
    error: "ஏதோ தவறு ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
  },

  gu: {
    welcome: "ફરીથી સ્વાગત છે",
    title: "તમારું સ્વાસ્થ્ય, તમારી સફર.",
    description: "તમારી આરોગ્ય સંભાળની સફર અહીંથી શરૂ થાય છે. તમારા MediKiosk ખાતામાં પ્રવેશ કરો.",
    benefits: ["વાપરવામાં સરળ", "આરોગ્યની માહિતી એક જ જગ્યાએ", "વધુ સારી તબીબી સલાહ"],
    care: "તમારી સંભાળ મહત્વપૂર્ણ છે",
    security: "તમારા નોંધાયેલા ખાતાના ઈમેલ અને પાસવર્ડથી પ્રવેશ કરો.",
    account: "તમારું ખાતું",
    signIn: "લૉગ ઇન કરો",
    formDescription: "આગળ વધવા માટે તમારી વિગતો દાખલ કરો.",
    email: "ઈમેલ સરનામું",
    emailPlaceholder: "you@example.com",
    password: "પાસવર્ડ",
    passwordPlaceholder: "તમારો પાસવર્ડ દાખલ કરો",
    showPassword: "પાસવર્ડ બતાવો",
    hidePassword: "પાસવર્ડ છુપાવો",
    signingIn: "લૉગ ઇન થઈ રહ્યું છે...",
    noAccount: "ખાતું નથી?",
    createAccount: "ખાતું બનાવો",
    footer: "તમારું સ્વાસ્થ્ય, અમારી પ્રાથમિકતા.",
    invalid: "ઈમેલ અથવા પાસવર્ડ ખોટો છે.",
    server: "સર્વર સાથે જોડાઈ શકાતું નથી.",
    roleError: "ખાતાનો પ્રકાર ઓળખી શકાયો નથી.",
    invalidRole: "ખાતાનો પ્રકાર ખોટો છે.",
    error: "કંઈક ખોટું થયું. ફરી પ્રયાસ કરો.",
  },

  kn: {
    welcome: "ಮತ್ತೆ ಸ್ವಾಗತ",
    title: "ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಿಮ್ಮ ಪ್ರಯಾಣ.",
    description: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಸೇವೆಯ ಪ್ರಯಾಣ ಇಲ್ಲಿಂದ ಆರಂಭವಾಗುತ್ತದೆ. ನಿಮ್ಮ MediKiosk ಖಾತೆಗೆ ಪ್ರವೇಶಿಸಿ.",
    benefits: ["ಬಳಸಲು ಸುಲಭ", "ಆರೋಗ್ಯ ಮಾಹಿತಿ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ", "ಉತ್ತಮ ವೈದ್ಯಕೀಯ ಸಮಾಲೋಚನೆ"],
    care: "ನಿಮ್ಮ ಆರೈಕೆ ಮುಖ್ಯ",
    security: "ನಿಮ್ಮ ನೋಂದಾಯಿತ ಖಾತೆಯ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ.",
    account: "ನಿಮ್ಮ ಖಾತೆ",
    signIn: "ಲಾಗಿನ್ ಮಾಡಿ",
    formDescription: "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    emailPlaceholder: "you@example.com",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    passwordPlaceholder: "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
    showPassword: "ಪಾಸ್‌ವರ್ಡ್ ತೋರಿಸಿ",
    hidePassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆಮಾಡಿ",
    signingIn: "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...",
    noAccount: "ಖಾತೆ ಇಲ್ಲವೇ?",
    createAccount: "ಖಾತೆ ರಚಿಸಿ",
    footer: "ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಮ್ಮ ಆದ್ಯತೆ.",
    invalid: "ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ.",
    server: "ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    roleError: "ಖಾತೆಯ ಪಾತ್ರವನ್ನು ಗುರುತಿಸಲಾಗಲಿಲ್ಲ.",
    invalidRole: "ಖಾತೆಯ ಪಾತ್ರ ತಪ್ಪಾಗಿದೆ.",
    error: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  },

  ml: {
    welcome: "വീണ്ടും സ്വാഗതം",
    title: "നിങ്ങളുടെ ആരോഗ്യം, നിങ്ങളുടെ യാത്ര.",
    description: "നിങ്ങളുടെ ആരോഗ്യപരിചരണ യാത്ര ഇവിടെ തുടങ്ങുന്നു. നിങ്ങളുടെ MediKiosk അക്കൗണ്ടിൽ പ്രവേശിക്കുക.",
    benefits: ["ഉപയോഗിക്കാൻ എളുപ്പം", "ആരോഗ്യവിവരങ്ങൾ ഒരിടത്ത്", "മെച്ചപ്പെട്ട മെഡിക്കൽ കൂടിയാലോചന"],
    care: "നിങ്ങളുടെ പരിചരണം പ്രധാനമാണ്",
    security: "നിങ്ങളുടെ രജിസ്റ്റർ ചെയ്ത അക്കൗണ്ടിന്റെ ഇമെയിലും പാസ്‌വേഡും ഉപയോഗിക്കുക.",
    account: "നിങ്ങളുടെ അക്കൗണ്ട്",
    signIn: "സൈൻ ഇൻ ചെയ്യുക",
    formDescription: "തുടരാൻ നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക.",
    email: "ഇമെയിൽ വിലാസം",
    emailPlaceholder: "you@example.com",
    password: "പാസ്‌വേഡ്",
    passwordPlaceholder: "പാസ്‌വേഡ് നൽകുക",
    showPassword: "പാസ്‌വേഡ് കാണിക്കുക",
    hidePassword: "പാസ്‌വേഡ് മറയ്ക്കുക",
    signingIn: "സൈൻ ഇൻ ചെയ്യുന്നു...",
    noAccount: "അക്കൗണ്ട് ഇല്ലേ?",
    createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    footer: "നിങ്ങളുടെ ആരോഗ്യം, ഞങ്ങളുടെ മുൻഗണന.",
    invalid: "ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ് തെറ്റാണ്.",
    server: "സെർവറുമായി ബന്ധപ്പെടാൻ കഴിഞ്ഞില്ല.",
    roleError: "അക്കൗണ്ട് തരം തിരിച്ചറിയാനായില്ല.",
    invalidRole: "അക്കൗണ്ട് തരം തെറ്റാണ്.",
    error: "എന്തോ തെറ്റായി. വീണ്ടും ശ്രമിക്കുക.",
  },

  pa: {
    welcome: "ਮੁੜ ਸੁਆਗਤ ਹੈ",
    title: "ਤੁਹਾਡੀ ਸਿਹਤ, ਤੁਹਾਡਾ ਸਫ਼ਰ।",
    description: "ਤੁਹਾਡੀ ਸਿਹਤ ਸੰਭਾਲ ਦਾ ਸਫ਼ਰ ਇੱਥੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਆਪਣੇ MediKiosk ਖਾਤੇ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ।",
    benefits: ["ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ", "ਸਿਹਤ ਦੀ ਜਾਣਕਾਰੀ ਇੱਕ ਥਾਂ", "ਬਿਹਤਰ ਡਾਕਟਰੀ ਸਲਾਹ"],
    care: "ਤੁਹਾਡੀ ਦੇਖਭਾਲ ਮਹੱਤਵਪੂਰਨ ਹੈ",
    security: "ਆਪਣੇ ਰਜਿਸਟਰ ਕੀਤੇ ਖਾਤੇ ਦਾ ਈਮੇਲ ਅਤੇ ਪਾਸਵਰਡ ਵਰਤੋ।",
    account: "ਤੁਹਾਡਾ ਖਾਤਾ",
    signIn: "ਲੌਗ ਇਨ ਕਰੋ",
    formDescription: "ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਜਾਣਕਾਰੀ ਭਰੋ।",
    email: "ਈਮੇਲ ਪਤਾ",
    emailPlaceholder: "you@example.com",
    password: "ਪਾਸਵਰਡ",
    passwordPlaceholder: "ਆਪਣਾ ਪਾਸਵਰਡ ਭਰੋ",
    showPassword: "ਪਾਸਵਰਡ ਦਿਖਾਓ",
    hidePassword: "ਪਾਸਵਰਡ ਲੁਕਾਓ",
    signingIn: "ਲੌਗ ਇਨ ਹੋ ਰਿਹਾ ਹੈ...",
    noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    createAccount: "ਖਾਤਾ ਬਣਾਓ",
    footer: "ਤੁਹਾਡੀ ਸਿਹਤ, ਸਾਡੀ ਪਹਿਲ।",
    invalid: "ਈਮੇਲ ਜਾਂ ਪਾਸਵਰਡ ਗਲਤ ਹੈ।",
    server: "ਸਰਵਰ ਨਾਲ ਸੰਪਰਕ ਨਹੀਂ ਹੋ ਸਕਿਆ।",
    roleError: "ਖਾਤੇ ਦੀ ਕਿਸਮ ਪਤਾ ਨਹੀਂ ਲੱਗੀ।",
    invalidRole: "ਖਾਤੇ ਦੀ ਕਿਸਮ ਗਲਤ ਹੈ।",
    error: "ਕੁਝ ਗਲਤ ਹੋਇਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  },
};

function getLanguageCode(value) {
  const language = String(value || "en").toLowerCase();

  const aliases = {
    english: "en",
    hindi: "hi",
    bengali: "bn",
    bangla: "bn",
    marathi: "mr",
    telugu: "te",
    tamil: "ta",
    gujarati: "gu",
    kannada: "kn",
    malayalam: "ml",
    punjabi: "pa",
  };

  const code = aliases[language] || language;

  return translations[code] ? code : "en";
}

export default function Login() {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    getLanguageCode(sessionStorage.getItem("medikioskLanguage"))
  );

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const t = translations[selectedLanguage];

  function changeLanguage(language) {
    const code = getLanguageCode(language);

    setSelectedLanguage(code);
    sessionStorage.setItem("medikioskLanguage", code);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || t.invalid);
      }

      const user = result.user;

      if (!user || !user.role) {
        throw new Error(t.roleError);
      }

      sessionStorage.setItem("medikioskUser", JSON.stringify(user));

      if (user.role === "patient") {
        navigate("/patient/dashboard", { replace: true });
      } else if (user.role === "doctor") {
        navigate("/doctor/dashboard", { replace: true });
      } else {
        sessionStorage.removeItem("medikioskUser");
        throw new Error(t.invalidRole);
      }
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? t.server
          : error.message || t.error
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8F7F1] px-0 py-0">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-[#DDEAE1]/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#F2E2D6]/60 blur-3xl" />

     <div className="relative w-full">
  <MediKioskHeader
    selectedLanguage={selectedLanguage}
    onLanguageChange={changeLanguage}
  />

  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">

        <div className="mx-auto mt-8 grid max-w-5xl overflow-hidden rounded-3xl border border-[#E3E9E0] bg-white shadow-xl shadow-[#214A43]/5 lg:grid-cols-2">
          {/* Welcome panel */}
          <aside className="relative overflow-hidden bg-[#214A43] p-7 text-white sm:p-10 lg:p-12">
            <div className="absolute -right-16 -top-16 h-60 w-60 rounded-full border border-white/10" />
            <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full border border-white/10" />

            <div className="relative">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <HeartPulse size={32} />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[2px] text-[#B8D8C5]">
                {t.welcome}
              </p>

              <h1 className="font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                {t.title}
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/75 sm:text-base">
                {t.description}
              </p>

              <div className="mt-9 space-y-4">
                {t.benefits.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="shrink-0 text-[#B8D8C5]"
                    />
                    <span className="text-sm text-white/90">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] p-4">
                <ShieldCheck
                  size={27}
                  className="shrink-0 text-[#B8D8C5]"
                />

                <div>
                  <p className="font-semibold">{t.care}</p>
                  <p className="mt-1 text-xs leading-5 text-white/70">
                    {t.security}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Login form */}
          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#7CA49A]">
                {t.account}
              </p>

              <h2 className="text-3xl font-bold text-[#214A43]">
                {t.signIn}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#789087]">
                {t.formDescription}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#315E54]"
                >
                  {t.email}
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#315E54]"
                >
                  {t.password}
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.passwordPlaceholder}
                    autoComplete="current-password"
                    required
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? t.hidePassword : t.showPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#789087] hover:text-[#214A43]"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  role="alert"
                  className="rounded-xl bg-[#FBE9E5] p-3 text-sm leading-6 text-[#9D4337]"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#47796F] px-6 py-4 font-semibold text-white shadow-lg shadow-[#47796F]/20 transition hover:-translate-y-0.5 hover:bg-[#315E54] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? t.signingIn : t.signIn}

                {!loading && (
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              <p className="pt-2 text-center text-sm text-[#789087]">
                {t.noAccount}{" "}
                <Link
                  to="/signup"
                  className="font-bold text-[#47796F] hover:text-[#214A43]"
                >
                  {t.createAccount}
                </Link>
              </p>
            </form>
          </section>
        </div>

        <p className="mt-6 text-center text-xs text-[#8AA097]">
          © {new Date().getFullYear()} MediKiosk · {t.footer}
        </p>
      </div>
      </div>
    </main>
  );
}
