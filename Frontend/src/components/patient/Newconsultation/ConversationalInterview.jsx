
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Check,
} from "lucide-react";

import { getNextQuestion } from "../../../../services/healthInterviewService";

const speechLanguages = {
  en: "en-IN",
  hi: "hi-IN",
  bn: "bn-IN",
  ta: "ta-IN",
  te: "te-IN",
  mr: "mr-IN",
  gu: "gu-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  pa: "pa-IN",
};

const translations = {
  en: {
    assistant: "Health Assistant",
    subtitle: "Voice & Touch Patient Interview",
    welcome: "Welcome to Mediokiosk",
    welcomeMessage: "Please describe what has been bothering you. You can type your symptoms or use the microphone. I'll ask relevant questions to understand your concern.",
    speak: "Speak your symptoms",
    type: "Type your symptoms",
    listen: "Listen again",
    selectAll: "Select all applicable answers",
    selectOne: "Select one answer",
    processing: "Processing your response...",
    listening: "Listening... Speak now",
    placeholder: "Describe what has been bothering you...",
    answerPlaceholder: "Type or speak your answer...",
    listeningPlaceholder: "Listening to your answer...",
    helper: "You can type, speak or select an answer",
    repeat: "Repeat question",
    voiceError: "Voice recognition is not supported in this browser. Please use Chrome or type your answer.",
    error: "Sorry, I couldn't process your response. Please try again.",
  },
  hi: {
    assistant: "स्वास्थ्य सहायक",
    subtitle: "आवाज़ और स्पर्श द्वारा मरीज का इंटरव्यू",
    welcome: "Mediokiosk में आपका स्वागत है",
    welcomeMessage: "कृपया बताएं कि आपको क्या परेशानी हो रही है। आप अपने लक्षण टाइप कर सकते हैं या माइक्रोफ़ोन से बोल सकते हैं।",
    speak: "अपने लक्षण बोलें",
    type: "अपने लक्षण टाइप करें",
    listen: "दोबारा सुनें",
    selectAll: "लागू होने वाले सभी उत्तर चुनें",
    selectOne: "एक उत्तर चुनें",
    processing: "आपके जवाब को प्रोसेस किया जा रहा है...",
    listening: "सुन रहा है... अब बोलें",
    placeholder: "बताएं कि आपको क्या परेशानी हो रही है...",
    answerPlaceholder: "अपना जवाब टाइप करें या बोलें...",
    listeningPlaceholder: "आपका जवाब सुना जा रहा है...",
    helper: "आप टाइप कर सकते हैं, बोल सकते हैं या जवाब चुन सकते हैं",
    repeat: "सवाल दोबारा सुनें",
    voiceError: "इस ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है। कृपया Chrome का उपयोग करें या जवाब टाइप करें।",
    error: "माफ़ कीजिए, आपका जवाब प्रोसेस नहीं हो सका। कृपया दोबारा प्रयास करें।",
  },
  bn: {
    assistant: "স্বাস্থ্য সহকারী",
    subtitle: "ভয়েস ও টাচ রোগীর সাক্ষাৎকার",
    welcome: "Mediokiosk-এ স্বাগতম",
    welcomeMessage: "আপনার কী সমস্যা হচ্ছে তা বলুন। আপনি আপনার লক্ষণ টাইপ করতে পারেন অথবা মাইক্রোফোন ব্যবহার করতে পারেন।",
    speak: "আপনার লক্ষণ বলুন",
    type: "আপনার লক্ষণ লিখুন",
    listen: "আবার শুনুন",
    selectAll: "প্রযোজ্য সব উত্তর নির্বাচন করুন",
    selectOne: "একটি উত্তর নির্বাচন করুন",
    processing: "আপনার উত্তর প্রক্রিয়া করা হচ্ছে...",
    listening: "শোনা হচ্ছে... এখন বলুন",
    placeholder: "আপনার কী সমস্যা হচ্ছে তা লিখুন...",
    answerPlaceholder: "আপনার উত্তর লিখুন বা বলুন...",
    listeningPlaceholder: "আপনার উত্তর শোনা হচ্ছে...",
    helper: "আপনি লিখতে, বলতে বা উত্তর নির্বাচন করতে পারেন",
    repeat: "প্রশ্ন আবার শুনুন",
    voiceError: "এই ব্রাউজারে ভয়েস রিকগনিশন সমর্থিত নয়। Chrome ব্যবহার করুন অথবা উত্তর লিখুন।",
    error: "দুঃখিত, আপনার উত্তর প্রক্রিয়া করা যায়নি। আবার চেষ্টা করুন।",
  },
  ta: {
    assistant: "சுகாதார உதவியாளர்",
    subtitle: "குரல் மற்றும் தொடுதல் நோயாளர் நேர்காணல்",
    welcome: "Mediokiosk-க்கு வரவேற்கிறோம்",
    welcomeMessage: "உங்களுக்கு என்ன பிரச்சனை என்பதைச் சொல்லுங்கள். உங்கள் அறிகுறிகளைத் தட்டச்சு செய்யலாம் அல்லது மைக்ரோஃபோனைப் பயன்படுத்தலாம்.",
    speak: "உங்கள் அறிகுறிகளைப் பேசுங்கள்",
    type: "உங்கள் அறிகுறிகளைத் தட்டச்சு செய்யுங்கள்",
    listen: "மீண்டும் கேளுங்கள்",
    selectAll: "பொருந்தும் அனைத்து பதில்களையும் தேர்ந்தெடுக்கவும்",
    selectOne: "ஒரு பதிலைத் தேர்ந்தெடுக்கவும்",
    processing: "உங்கள் பதில் செயலாக்கப்படுகிறது...",
    listening: "கேட்கிறது... இப்போது பேசுங்கள்",
    placeholder: "உங்களுக்கு என்ன பிரச்சனை என்பதை விவரிக்கவும்...",
    answerPlaceholder: "உங்கள் பதிலைத் தட்டச்சு செய்யவும் அல்லது பேசவும்...",
    listeningPlaceholder: "உங்கள் பதில் கேட்கப்படுகிறது...",
    helper: "நீங்கள் தட்டச்சு செய்யலாம், பேசலாம் அல்லது பதிலைத் தேர்ந்தெடுக்கலாம்",
    repeat: "கேள்வியை மீண்டும் கேளுங்கள்",
    voiceError: "இந்த உலாவியில் குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை. Chrome பயன்படுத்தவும் அல்லது பதிலைத் தட்டச்சு செய்யவும்.",
    error: "மன்னிக்கவும், உங்கள் பதிலைச் செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
  },
  te: {
    assistant: "ఆరోగ్య సహాయకుడు",
    subtitle: "వాయిస్ మరియు టచ్ రోగి ఇంటర్వ్యూ",
    welcome: "Mediokiosk కు స్వాగతం",
    welcomeMessage: "మీకు ఉన్న సమస్యను వివరించండి. మీరు లక్షణాలను టైప్ చేయవచ్చు లేదా మైక్రోఫోన్ ఉపయోగించి మాట్లాడవచ్చు.",
    speak: "మీ లక్షణాలను చెప్పండి",
    type: "మీ లక్షణాలను టైప్ చేయండి",
    listen: "మళ్లీ వినండి",
    selectAll: "వర్తించే అన్ని సమాధానాలను ఎంచుకోండి",
    selectOne: "ఒక సమాధానాన్ని ఎంచుకోండి",
    processing: "మీ సమాధానం ప్రాసెస్ అవుతోంది...",
    listening: "వింటోంది... ఇప్పుడు మాట్లాడండి",
    placeholder: "మీకు ఉన్న సమస్యను వివరించండి...",
    answerPlaceholder: "మీ సమాధానాన్ని టైప్ చేయండి లేదా మాట్లాడండి...",
    listeningPlaceholder: "మీ సమాధానం వింటోంది...",
    helper: "మీరు టైప్ చేయవచ్చు, మాట్లాడవచ్చు లేదా సమాధానాన్ని ఎంచుకోవచ్చు",
    repeat: "ప్రశ్నను మళ్లీ వినండి",
    voiceError: "ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు అందుబాటులో లేదు. Chrome ఉపయోగించండి లేదా సమాధానం టైప్ చేయండి.",
    error: "క్షమించండి, మీ సమాధానాన్ని ప్రాసెస్ చేయలేకపోయాము. మళ్లీ ప్రయత్నించండి.",
  },
  mr: {
    assistant: "आरोग्य सहाय्यक",
    subtitle: "आवाज आणि स्पर्शाद्वारे रुग्णाची मुलाखत",
    welcome: "Mediokiosk मध्ये आपले स्वागत आहे",
    welcomeMessage: "तुम्हाला काय त्रास होत आहे ते सांगा. तुम्ही तुमची लक्षणे टाइप करू शकता किंवा मायक्रोफोन वापरून बोलू शकता.",
    speak: "तुमची लक्षणे सांगा",
    type: "तुमची लक्षणे टाइप करा",
    listen: "पुन्हा ऐका",
    selectAll: "लागू होणारी सर्व उत्तरे निवडा",
    selectOne: "एक उत्तर निवडा",
    processing: "तुमचे उत्तर प्रक्रिया केले जात आहे...",
    listening: "ऐकत आहे... आता बोला",
    placeholder: "तुम्हाला काय त्रास होत आहे ते सांगा...",
    answerPlaceholder: "तुमचे उत्तर टाइप करा किंवा बोला...",
    listeningPlaceholder: "तुमचे उत्तर ऐकत आहे...",
    helper: "तुम्ही टाइप करू शकता, बोलू शकता किंवा उत्तर निवडू शकता",
    repeat: "प्रश्न पुन्हा ऐका",
    voiceError: "या ब्राउझरमध्ये व्हॉइस रिकग्निशन उपलब्ध नाही. Chrome वापरा किंवा उत्तर टाइप करा.",
    error: "क्षमस्व, तुमचे उत्तर प्रक्रिया करता आले नाही. पुन्हा प्रयत्न करा.",
  },
  gu: {
    assistant: "આરોગ્ય સહાયક",
    subtitle: "અવાજ અને સ્પર્શ દ્વારા દર્દી ઇન્ટરવ્યૂ",
    welcome: "Mediokiosk માં આપનું સ્વાગત છે",
    welcomeMessage: "તમને શું તકલીફ થઈ રહી છે તે જણાવો. તમે તમારા લક્ષણો ટાઇપ કરી શકો છો અથવા માઇક્રોફોનનો ઉપયોગ કરી શકો છો.",
    speak: "તમારા લક્ષણો બોલો",
    type: "તમારા લક્ષણો ટાઇપ કરો",
    listen: "ફરીથી સાંભળો",
    selectAll: "લાગુ પડતા બધા જવાબો પસંદ કરો",
    selectOne: "એક જવાબ પસંદ કરો",
    processing: "તમારા જવાબની પ્રક્રિયા થઈ રહી છે...",
    listening: "સાંભળી રહ્યું છે... હવે બોલો",
    placeholder: "તમને શું તકલીફ થઈ રહી છે તે જણાવો...",
    answerPlaceholder: "તમારો જવાબ ટાઇપ કરો અથવા બોલો...",
    listeningPlaceholder: "તમારો જવાબ સાંભળી રહ્યું છે...",
    helper: "તમે ટાઇપ કરી શકો છો, બોલી શકો છો અથવા જવાબ પસંદ કરી શકો છો",
    repeat: "પ્રશ્ન ફરીથી સાંભળો",
    voiceError: "આ બ્રાઉઝરમાં વૉઇસ રેકગ્નિશન ઉપલબ્ધ નથી. Chrome નો ઉપયોગ કરો અથવા જવાબ ટાઇપ કરો.",
    error: "માફ કરશો, તમારા જવાબની પ્રક્રિયા થઈ શકી નથી. ફરી પ્રયાસ કરો.",
  },
  kn: {
    assistant: "ಆರೋಗ್ಯ ಸಹಾಯಕ",
    subtitle: "ಧ್ವನಿ ಮತ್ತು ಸ್ಪರ್ಶ ರೋಗಿಯ ಸಂದರ್ಶನ",
    welcome: "Mediokiosk ಗೆ ಸ್ವಾಗತ",
    welcomeMessage: "ನಿಮಗೆ ಏನು ತೊಂದರೆಯಾಗುತ್ತಿದೆ ಎಂಬುದನ್ನು ವಿವರಿಸಿ. ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಟೈಪ್ ಮಾಡಬಹುದು ಅಥವಾ ಮೈಕ್ರೊಫೋನ್ ಬಳಸಿ ಮಾತನಾಡಬಹುದು.",
    speak: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಹೇಳಿ",
    type: "ನಿಮ್ಮ ಲಕ್ಷಣಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ",
    listen: "ಮತ್ತೆ ಕೇಳಿ",
    selectAll: "ಅನ್ವಯಿಸುವ ಎಲ್ಲಾ ಉತ್ತರಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    selectOne: "ಒಂದು ಉತ್ತರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    processing: "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...",
    listening: "ಕೇಳಲಾಗುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    placeholder: "ನಿಮಗೆ ಏನು ತೊಂದರೆಯಾಗುತ್ತಿದೆ ಎಂದು ವಿವರಿಸಿ...",
    answerPlaceholder: "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮಾತನಾಡಿ...",
    listeningPlaceholder: "ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಕೇಳಲಾಗುತ್ತಿದೆ...",
    helper: "ನೀವು ಟೈಪ್ ಮಾಡಬಹುದು, ಮಾತನಾಡಬಹುದು ಅಥವಾ ಉತ್ತರವನ್ನು ಆಯ್ಕೆಮಾಡಬಹುದು",
    repeat: "ಪ್ರಶ್ನೆಯನ್ನು ಮತ್ತೆ ಕೇಳಿ",
    voiceError: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಲಭ್ಯವಿಲ್ಲ. Chrome ಬಳಸಿ ಅಥವಾ ಉತ್ತರವನ್ನು ಟೈಪ್ ಮಾಡಿ.",
    error: "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  },
  ml: {
    assistant: "ആരോഗ്യ സഹായി",
    subtitle: "ശബ്ദവും സ്പർശനവും ഉപയോഗിച്ചുള്ള രോഗി അഭിമുഖം",
    welcome: "Mediokiosk-ലേക്ക് സ്വാഗതം",
    welcomeMessage: "നിങ്ങൾക്ക് എന്താണ് ബുദ്ധിമുട്ടെന്ന് വിവരിക്കുക. നിങ്ങളുടെ ലക്ഷണങ്ങൾ ടൈപ്പ് ചെയ്യുകയോ മൈക്രോഫോൺ ഉപയോഗിച്ച് സംസാരിക്കുകയോ ചെയ്യാം.",
    speak: "നിങ്ങളുടെ ലക്ഷണങ്ങൾ പറയുക",
    type: "നിങ്ങളുടെ ലക്ഷണങ്ങൾ ടൈപ്പ് ചെയ്യുക",
    listen: "വീണ്ടും കേൾക്കുക",
    selectAll: "ബാധകമായ എല്ലാ ഉത്തരങ്ങളും തിരഞ്ഞെടുക്കുക",
    selectOne: "ഒരു ഉത്തരം തിരഞ്ഞെടുക്കുക",
    processing: "നിങ്ങളുടെ ഉത്തരം പ്രോസസ്സ് ചെയ്യുന്നു...",
    listening: "കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
    placeholder: "നിങ്ങൾക്ക് എന്താണ് ബുദ്ധിമുട്ടെന്ന് വിവരിക്കുക...",
    answerPlaceholder: "നിങ്ങളുടെ ഉത്തരം ടൈപ്പ് ചെയ്യുകയോ പറയുകയോ ചെയ്യുക...",
    listeningPlaceholder: "നിങ്ങളുടെ ഉത്തരം കേൾക്കുന്നു...",
    helper: "നിങ്ങൾക്ക് ടൈപ്പ് ചെയ്യാം, സംസാരിക്കാം അല്ലെങ്കിൽ ഉത്തരം തിരഞ്ഞെടുക്കാം",
    repeat: "ചോദ്യം വീണ്ടും കേൾക്കുക",
    voiceError: "ഈ ബ്രൗസറിൽ വോയ്സ് റെക്കഗ്നിഷൻ ലഭ്യമല്ല. Chrome ഉപയോഗിക്കുക അല്ലെങ്കിൽ ഉത്തരം ടൈപ്പ് ചെയ്യുക.",
    error: "ക്ഷമിക്കണം, നിങ്ങളുടെ ഉത്തരം പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",
  },
  pa: {
    assistant: "ਸਿਹਤ ਸਹਾਇਕ",
    subtitle: "ਆਵਾਜ਼ ਅਤੇ ਟੱਚ ਰਾਹੀਂ ਮਰੀਜ਼ ਇੰਟਰਵਿਊ",
    welcome: "Mediokiosk ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
    welcomeMessage: "ਕਿਰਪਾ ਕਰਕੇ ਦੱਸੋ ਕਿ ਤੁਹਾਨੂੰ ਕੀ ਪਰੇਸ਼ਾਨੀ ਹੋ ਰਹੀ ਹੈ। ਤੁਸੀਂ ਆਪਣੇ ਲੱਛਣ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ ਜਾਂ ਮਾਈਕ੍ਰੋਫ਼ੋਨ ਰਾਹੀਂ ਬੋਲ ਸਕਦੇ ਹੋ।",
    speak: "ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ",
    type: "ਆਪਣੇ ਲੱਛਣ ਟਾਈਪ ਕਰੋ",
    listen: "ਦੁਬਾਰਾ ਸੁਣੋ",
    selectAll: "ਲਾਗੂ ਹੋਣ ਵਾਲੇ ਸਾਰੇ ਜਵਾਬ ਚੁਣੋ",
    selectOne: "ਇੱਕ ਜਵਾਬ ਚੁਣੋ",
    processing: "ਤੁਹਾਡੇ ਜਵਾਬ ਦੀ ਪ੍ਰਕਿਰਿਆ ਹੋ ਰਹੀ ਹੈ...",
    listening: "ਸੁਣ ਰਿਹਾ ਹੈ... ਹੁਣ ਬੋਲੋ",
    placeholder: "ਦੱਸੋ ਕਿ ਤੁਹਾਨੂੰ ਕੀ ਪਰੇਸ਼ਾਨੀ ਹੋ ਰਹੀ ਹੈ...",
    answerPlaceholder: "ਆਪਣਾ ਜਵਾਬ ਟਾਈਪ ਕਰੋ ਜਾਂ ਬੋਲੋ...",
    listeningPlaceholder: "ਤੁਹਾਡਾ ਜਵਾਬ ਸੁਣਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    helper: "ਤੁਸੀਂ ਟਾਈਪ ਕਰ ਸਕਦੇ ਹੋ, ਬੋਲ ਸਕਦੇ ਹੋ ਜਾਂ ਜਵਾਬ ਚੁਣ ਸਕਦੇ ਹੋ",
    repeat: "ਸਵਾਲ ਦੁਬਾਰਾ ਸੁਣੋ",
    voiceError: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਵੌਇਸ ਰਿਕਗਨੀਸ਼ਨ ਉਪਲਬਧ ਨਹੀਂ ਹੈ। Chrome ਵਰਤੋ ਜਾਂ ਜਵਾਬ ਟਾਈਪ ਕਰੋ।",
    error: "ਮਾਫ਼ ਕਰਨਾ, ਤੁਹਾਡੇ ਜਵਾਬ ਦੀ ਪ੍ਰਕਿਰਿਆ ਨਹੀਂ ਹੋ ਸਕੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
  },
};

export default function ConversationalInterview({
  language = "en",
  onComplete,
}) {
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialComplaint, setInitialComplaint] = useState("");
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenRef = useRef(null);
  const mutedRef = useRef(false);

  const speechLanguage = speechLanguages[language] || "en-IN";
  const t = translations[language] || translations.en;

  useEffect(() => {
    setVoiceSupported(
      typeof window !== "undefined" &&
        ("SpeechRecognition" in window ||
          "webkitSpeechRecognition" in window)
    );

    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function speakAI(text) {
    if (
      typeof window === "undefined" ||
      mutedRef.current ||
      !window.speechSynthesis ||
      !text ||
      typeof text !== "string"
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = speechLanguage;
    utterance.rate = 0.94;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() === speechLanguage.toLowerCase()
      ) ||
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .startsWith(speechLanguage.split("-")[0])
      );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onerror = (event) => {
      console.error("AI speech error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  }

  // Speak welcome message in selected language
  useEffect(() => {
    const timer = setTimeout(() => {
      speakAI(`${t.welcome}. ${t.welcomeMessage}`);
    }, 500);

    return () => clearTimeout(timer);
  }, [language]);

  // Automatically speak new AI questions
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (
      lastMessage?.role === "assistant" &&
      lastMessage.content &&
      lastMessage.id !== lastSpokenRef.current
    ) {
      lastSpokenRef.current = lastMessage.id;
      speakAI(lastMessage.content);
    }
  }, [messages, language]);

  // Patient voice input
  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.voiceError);
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();

    recognition.lang = speechLanguage;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setAnswer((previous) =>
        previous.startsWith("Other:")
          ? `Other: ${transcript}`
          : transcript
      );
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Unable to start voice recognition:", error);
      setListening(false);
    }
  }

  function toggleMute() {
    const nextMuted = !muted;

    setMuted(nextMuted);
    mutedRef.current = nextMuted;

    if (nextMuted) {
      window.speechSynthesis?.cancel();
    } else {
      const lastMessage = [...messages]
        .reverse()
        .find((message) => message.role === "assistant");

      if (lastMessage?.content) {
        speakAI(lastMessage.content);
      } else if (!started) {
        speakAI(`${t.welcome}. ${t.welcomeMessage}`);
      }
    }
  }

  function replayQuestion() {
    const lastMessage = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    if (lastMessage?.content) {
      speakAI(lastMessage.content);
    } else if (!started) {
      speakAI(`${t.welcome}. ${t.welcomeMessage}`);
    }
  }

  async function handleSend(event) {
    event?.preventDefault();

    if (loading) return;

    const typedAnswer = answer.trim();
    let finalAnswer = "";

    if (selectedOptions.length > 0) {
      const options = selectedOptions.filter(
        (option) => option !== "Other"
      );

      if (selectedOptions.includes("Other")) {
        const customAnswer = typedAnswer
          .replace(/^Other:\s*/i, "")
          .trim();

        if (!customAnswer) {
          inputRef.current?.focus();
          return;
        }

        options.push(`Other: ${customAnswer}`);
      }

      if (typedAnswer && !selectedOptions.includes("Other")) {
        options.push(typedAnswer);
      }

      finalAnswer = options.join(", ");
    } else {
      finalAnswer = typedAnswer;
    }

    if (!finalAnswer) return;

    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();

    const complaint = initialComplaint || finalAnswer;

    const updatedMessages = [
      ...messages,
      {
        id: Date.now(),
        role: "user",
        content: finalAnswer,
      },
    ];

    setStarted(true);
    setMessages(updatedMessages);
    setAnswer("");
    setSelectedOptions([]);
    setLoading(true);

    if (!initialComplaint) {
      setInitialComplaint(finalAnswer);
    }

    try {
      const result = await getNextQuestion(
        complaint,
        updatedMessages.map(({ role, content }) => ({
          role,
          content,
        })),
        language
      );

      console.log("AI API RESPONSE:", result);

      const resultData = result?.data ?? result;

      if (resultData.status === "continue") {
        const nextQuestion =
          resultData.question || resultData.nextQuestion;

        if (
          typeof nextQuestion !== "string" ||
          !nextQuestion.trim()
        ) {
          throw new Error("AI question is missing from the response.");
        }

        const allowedInputTypes = [
          "single_select",
          "multi_select",
          "yes_no",
          "free_text",
        ];

        const inputType = allowedInputTypes.includes(
          resultData.inputType
        )
          ? resultData.inputType
          : "free_text";

        const options = Array.isArray(resultData.options)
          ? resultData.options.filter(
              (option) =>
                typeof option === "string" && option.trim()
            )
          : [];

        setMessages((previous) => [
          ...previous,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: nextQuestion.trim(),
            inputType,
            options,
          },
        ]);
      } else if (
        resultData.status === "completed" &&
        typeof resultData.summary === "string"
      ) {
        onComplete?.(resultData.summary);
      } else {
        throw new Error("Unexpected response received from the AI.");
      }
    } catch (error) {
      console.error("Interview error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: t.error,
          inputType: "free_text",
          options: [],
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleOptionClick(option, inputType) {
    if (loading) return;

    if (option === "Other") {
      setSelectedOptions((previous) =>
        previous.includes("Other")
          ? previous.filter((item) => item !== "Other")
          : inputType === "multi_select"
            ? [
                ...previous.filter(
                  (item) => item !== "None of these"
                ),
                "Other",
              ]
            : ["Other"]
      );

      setAnswer((previous) =>
        previous.startsWith("Other:") ? previous : "Other: "
      );

      inputRef.current?.focus();
      return;
    }

    if (inputType === "multi_select") {
      setSelectedOptions((previous) => {
        if (option === "None of these") {
          return previous.includes(option) ? [] : [option];
        }

        const withoutNone = previous.filter(
          (item) => item !== "None of these"
        );

        return withoutNone.includes(option)
          ? withoutNone.filter((item) => item !== option)
          : [...withoutNone, option];
      });

      return;
    }

    setSelectedOptions((previous) =>
      previous.includes(option) ? [] : [option]
    );
  }

  const currentQuestion = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

  const isMultiSelect =
    currentQuestion?.inputType === "multi_select";

  return (
    <section className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EDF0EA] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
            <Bot size={22} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#214D43]">
              {t.assistant}
            </h3>

            <p className="text-xs text-gray-500">
              {t.subtitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="rounded-full p-2 text-[#47796E] hover:bg-[#E0EEE7]"
          title={muted ? "Enable AI voice" : "Mute AI voice"}
          aria-label={muted ? "Enable AI voice" : "Mute AI voice"}
        >
          {muted ? (
            <VolumeX size={19} />
          ) : (
            <Volume2 size={19} />
          )}
        </button>
      </div>

      {/* Assessment area */}
      <div className="min-h-[300px] px-4 py-8 sm:px-8">
        {!started ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
              <Sparkles size={28} />
            </div>

            <h4 className="text-lg font-semibold text-[#214D43]">
              {t.welcome}
            </h4>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-500">
              {t.welcomeMessage}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-[#47796E]">
              <span className="flex items-center gap-1.5">
                <Mic size={15} />
                {t.speak}
              </span>

              <span className="flex items-center gap-1.5">
                <Send size={14} />
                {t.type}
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex min-h-[280px] max-w-2xl flex-col justify-center">
            {currentQuestion ? (
              <>
                <div className="text-left">
                  <h4 className="text-xl font-semibold leading-8 text-[#214D43] sm:text-2xl">
                    {currentQuestion.content}
                  </h4>

                  <button
                    type="button"
                    onClick={() => speakAI(currentQuestion.content)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#47796E] hover:underline"
                  >
                    <Volume2 size={14} />
                    {t.listen}
                  </button>
                </div>

                {currentQuestion.options?.length > 0 && (
                  <div className="mt-8 w-full">
                    <div className="mb-3 text-left text-xs font-medium text-gray-500">
                      {isMultiSelect
                        ? t.selectAll
                        : t.selectOne}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected =
                          selectedOptions.includes(option);

                        return (
                          <button
                            key={`${option}-${index}`}
                            type="button"
                            disabled={loading}
                            onClick={() =>
                              handleOptionClick(
                                option,
                                currentQuestion.inputType
                              )
                            }
                            className={`flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all disabled:opacity-50 ${
                              isSelected
                                ? "border-[#326F61] bg-[#E1EFE7] text-[#285C50] shadow-sm"
                                : "border-[#DDE5DF] bg-[#F3F7F3] text-gray-700 hover:border-[#789F8D] hover:bg-[#EAF2EC]"
                            }`}
                          >
                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${
                                isSelected
                                  ? "border-[#326F61] bg-[#326F61] text-white"
                                  : "border-[#C9D5CC] bg-white text-gray-500"
                              }`}
                            >
                              {isSelected ? (
                                <Check size={14} />
                              ) : (
                                String.fromCharCode(65 + index)
                              )}
                            </span>

                            <span className="flex-1">
                              {option}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#DDE8DF] border-t-[#326F61]" />
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#47796E]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#DDE8DF] border-t-[#326F61]" />
            {t.processing}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Voice status */}
      {listening && (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-xl bg-[#EAF3ED] px-4 py-3 text-sm text-[#326F61] sm:mx-6">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          {t.listening}
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-[#EDF0EA] px-4 py-5 sm:px-6">
        <form
          onSubmit={handleSend}
          className="mx-auto max-w-2xl"
        >
          <div className="flex items-end gap-2 rounded-2xl border border-[#DDE4DB] bg-[#FCFDFB] p-3 transition focus-within:border-[#9BBCAF] focus-within:shadow-sm">
            <button
              type="button"
              onClick={startListening}
              disabled={!voiceSupported || loading}
              aria-label={
                listening ? "Stop recording" : "Speak answer"
              }
              title={
                voiceSupported
                  ? "Speak your answer"
                  : "Voice recognition unavailable"
              }
              className={`mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                listening
                  ? "bg-red-500 text-white"
                  : "bg-[#E0EEE7] text-[#326F61] hover:bg-[#D3E7D9]"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {listening ? (
                <MicOff size={18} />
              ) : (
                <Mic size={18} />
              )}
            </button>

            <textarea
              ref={inputRef}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={
                listening
                  ? t.listeningPlaceholder
                  : !started
                    ? t.placeholder
                    : t.answerPlaceholder
              }
              rows={1}
              maxLength={2000}
              className="min-h-[40px] max-h-32 min-w-0 flex-1 resize-y bg-transparent px-1 py-2 text-sm leading-6 text-gray-700 outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              disabled={
                loading ||
                (!answer.trim() && selectedOptions.length === 0)
              }
              aria-label="Submit answer"
              className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#326F61] text-white transition hover:bg-[#285C50] disabled:cursor-not-allowed disabled:bg-[#DCE5DC] disabled:text-gray-400"
            >
              <Send size={17} />
            </button>
          </div>
        </form>

        <div className="mx-auto mt-3 flex max-w-2xl items-center justify-between">
          <p className="text-xs text-gray-400">
            {t.helper}
          </p>

          <button
            type="button"
            onClick={replayQuestion}
            className="flex items-center gap-1 text-xs font-medium text-[#47796E] hover:underline"
          >
            <RotateCcw size={13} />
            {t.repeat}
          </button>
        </div>
      </div>
    </section>
  );
}
