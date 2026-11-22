
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  FileImage,
  X,
  FileCheck2,
  AlertCircle,
  Eye,
} from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png"];

const translations = {
  en: {
    title: "Medical documents",
    subtitle: "Upload your relevant medical reports.",
    dragDrop: "Drag and drop your documents here",
    or: "Or select files from your device",
    choose: "Choose documents",
    formats: "PDF, JPG, PNG · Maximum 10 MB per file · Up to 5 files",
    selected: "Selected documents",
    noFiles: "No documents selected yet.",
    pdf: "PDF",
    image: "Image",
    preview: "Preview",
    close: "Close preview",
    onlyAllowed: "Only PDF, JPG and PNG files are allowed.",
    empty: "This file is empty.",
    maxSize: "File size must be 10 MB or smaller.",
    maxFiles: "You can upload a maximum of 5 documents.",
    duplicate: "Duplicate files were skipped.",
    remove: "Remove",
  },

  hi: {
    title: "चिकित्सा दस्तावेज़",
    subtitle: "अपनी संबंधित मेडिकल रिपोर्ट अपलोड करें।",
    dragDrop: "अपने दस्तावेज़ यहाँ खींचकर छोड़ें",
    or: "या अपने डिवाइस से फ़ाइलें चुनें",
    choose: "दस्तावेज़ चुनें",
    formats: "PDF, JPG, PNG · प्रत्येक फ़ाइल अधिकतम 10 MB · अधिकतम 5 फ़ाइलें",
    selected: "चुने गए दस्तावेज़",
    noFiles: "अभी तक कोई दस्तावेज़ नहीं चुना गया है।",
    pdf: "PDF",
    image: "छवि",
    preview: "देखें",
    close: "पूर्वावलोकन बंद करें",
    onlyAllowed: "केवल PDF, JPG और PNG फ़ाइलें स्वीकार की जाती हैं।",
    empty: "यह फ़ाइल खाली है।",
    maxSize: "फ़ाइल का आकार 10 MB या उससे कम होना चाहिए।",
    maxFiles: "आप अधिकतम 5 दस्तावेज़ अपलोड कर सकते हैं।",
    duplicate: "डुप्लिकेट फ़ाइलें छोड़ दी गईं।",
    remove: "हटाएँ",
  },

  gu: {
    title: "તબીબી દસ્તાવેજો",
    subtitle: "તમારા સંબંધિત મેડિકલ રિપોર્ટ અપલોડ કરો.",
    dragDrop: "તમારા દસ્તાવેજો અહીં ખેંચીને મૂકો",
    or: "અથવા તમારા ડિવાઇસમાંથી ફાઇલો પસંદ કરો",
    choose: "દસ્તાવેજો પસંદ કરો",
    formats: "PDF, JPG, PNG · દરેક ફાઇલ મહત્તમ 10 MB · વધુમાં વધુ 5 ફાઇલો",
    selected: "પસંદ કરેલા દસ્તાવેજો",
    noFiles: "હજુ સુધી કોઈ દસ્તાવેજ પસંદ કર્યો નથી.",
    pdf: "PDF",
    image: "છબી",
    preview: "પૂર્વાવલોકન",
    close: "પૂર્વાવલોકન બંધ કરો",
    onlyAllowed: "ફક્ત PDF, JPG અને PNG ફાઇલો માન્ય છે.",
    empty: "આ ફાઇલ ખાલી છે.",
    maxSize: "ફાઇલનું કદ 10 MB અથવા તેનાથી ઓછું હોવું જોઈએ.",
    maxFiles: "તમે વધુમાં વધુ 5 દસ્તાવેજો અપલોડ કરી શકો છો.",
    duplicate: "ડુપ્લિકેટ ફાઇલો છોડી દેવામાં આવી છે.",
    remove: "દૂર કરો",
  },

  mr: {
    title: "वैद्यकीय कागदपत्रे",
    subtitle: "तुमचे संबंधित वैद्यकीय अहवाल अपलोड करा.",
    dragDrop: "तुमची कागदपत्रे येथे ड्रॅग आणि ड्रॉप करा",
    or: "किंवा तुमच्या डिव्हाइसमधून फाइल निवडा",
    choose: "कागदपत्रे निवडा",
    formats: "PDF, JPG, PNG · प्रत्येक फाइल कमाल 10 MB · जास्तीत जास्त 5 फाइल",
    selected: "निवडलेली कागदपत्रे",
    noFiles: "अद्याप कोणतेही कागदपत्र निवडलेले नाही.",
    pdf: "PDF",
    image: "प्रतिमा",
    preview: "पूर्वावलोकन",
    close: "पूर्वावलोकन बंद करा",
    onlyAllowed: "फक्त PDF, JPG आणि PNG फाइल स्वीकारल्या जातात.",
    empty: "ही फाइल रिकामी आहे.",
    maxSize: "फाइलचा आकार 10 MB किंवा त्यापेक्षा कमी असावा.",
    maxFiles: "तुम्ही जास्तीत जास्त 5 कागदपत्रे अपलोड करू शकता.",
    duplicate: "डुप्लिकेट फाइल वगळल्या.",
    remove: "काढून टाका",
  },

  bn: {
    title: "চিকিৎসার নথিপত্র",
    subtitle: "আপনার প্রাসঙ্গিক মেডিকেল রিপোর্ট আপলোড করুন।",
    dragDrop: "আপনার নথিগুলি এখানে টেনে এনে ছেড়ে দিন",
    or: "অথবা আপনার ডিভাইস থেকে ফাইল নির্বাচন করুন",
    choose: "নথি নির্বাচন করুন",
    formats: "PDF, JPG, PNG · প্রতিটি ফাইল সর্বোচ্চ 10 MB · সর্বোচ্চ 5টি ফাইল",
    selected: "নির্বাচিত নথি",
    noFiles: "এখনও কোনো নথি নির্বাচন করা হয়নি।",
    pdf: "PDF",
    image: "ছবি",
    preview: "পূর্বরূপ",
    close: "পূর্বরূপ বন্ধ করুন",
    onlyAllowed: "শুধুমাত্র PDF, JPG এবং PNG ফাইল গ্রহণযোগ্য।",
    empty: "এই ফাইলটি খালি।",
    maxSize: "ফাইলের আকার 10 MB বা তার কম হতে হবে।",
    maxFiles: "আপনি সর্বোচ্চ 5টি নথি আপলোড করতে পারেন।",
    duplicate: "একই ফাইল একাধিকবার নির্বাচন করা হলে অতিরিক্ত ফাইল বাদ দেওয়া হয়েছে।",
    remove: "সরান",
  },

  ta: {
    title: "மருத்துவ ஆவணங்கள்",
    subtitle: "உங்கள் தொடர்புடைய மருத்துவ அறிக்கைகளைப் பதிவேற்றவும்.",
    dragDrop: "உங்கள் ஆவணங்களை இங்கே இழுத்து விடவும்",
    or: "அல்லது உங்கள் சாதனத்திலிருந்து கோப்புகளைத் தேர்ந்தெடுக்கவும்",
    choose: "ஆவணங்களைத் தேர்ந்தெடுக்கவும்",
    formats: "PDF, JPG, PNG · ஒவ்வொரு கோப்பும் அதிகபட்சம் 10 MB · அதிகபட்சம் 5 கோப்புகள்",
    selected: "தேர்ந்தெடுக்கப்பட்ட ஆவணங்கள்",
    noFiles: "இதுவரை எந்த ஆவணமும் தேர்ந்தெடுக்கப்படவில்லை.",
    pdf: "PDF",
    image: "படம்",
    preview: "முன்னோட்டம்",
    close: "முன்னோட்டத்தை மூடு",
    onlyAllowed: "PDF, JPG மற்றும் PNG கோப்புகள் மட்டுமே அனுமதிக்கப்படும்.",
    empty: "இந்தக் கோப்பு காலியாக உள்ளது.",
    maxSize: "கோப்பின் அளவு 10 MB அல்லது அதற்கும் குறைவாக இருக்க வேண்டும்.",
    maxFiles: "அதிகபட்சம் 5 ஆவணங்களைப் பதிவேற்றலாம்.",
    duplicate: "நகல் கோப்புகள் தவிர்க்கப்பட்டன.",
    remove: "அகற்று",
  },

  te: {
    title: "వైద్య పత్రాలు",
    subtitle: "మీ సంబంధిత వైద్య నివేదికలను అప్‌లోడ్ చేయండి.",
    dragDrop: "మీ పత్రాలను ఇక్కడకు లాగి వదలండి",
    or: "లేదా మీ పరికరం నుండి ఫైళ్లను ఎంచుకోండి",
    choose: "పత్రాలను ఎంచుకోండి",
    formats: "PDF, JPG, PNG · ఒక్కో ఫైల్ గరిష్టంగా 10 MB · గరిష్టంగా 5 ఫైళ్లు",
    selected: "ఎంచుకున్న పత్రాలు",
    noFiles: "ఇంకా ఎలాంటి పత్రాలు ఎంచుకోలేదు.",
    pdf: "PDF",
    image: "చిత్రం",
    preview: "ప్రివ్యూ",
    close: "ప్రివ్యూను మూసివేయండి",
    onlyAllowed: "PDF, JPG మరియు PNG ఫైళ్లు మాత్రమే అనుమతించబడతాయి.",
    empty: "ఈ ఫైల్ ఖాళీగా ఉంది.",
    maxSize: "ఫైల్ పరిమాణం 10 MB లేదా అంతకంటే తక్కువగా ఉండాలి.",
    maxFiles: "మీరు గరిష్టంగా 5 పత్రాలను అప్‌లోడ్ చేయవచ్చు.",
    duplicate: "నకిలీ ఫైళ్లు తొలగించబడ్డాయి.",
    remove: "తొలగించు",
  },

  kn: {
    title: "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    subtitle: "ನಿಮ್ಮ ಸಂಬಂಧಿತ ವೈದ್ಯಕೀಯ ವರದಿಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    dragDrop: "ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಇಲ್ಲಿ ಎಳೆದು ಬಿಡಿ",
    or: "ಅಥವಾ ನಿಮ್ಮ ಸಾಧನದಿಂದ ಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    choose: "ದಾಖಲೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    formats: "PDF, JPG, PNG · ಪ್ರತಿ ಫೈಲ್ ಗರಿಷ್ಠ 10 MB · ಗರಿಷ್ಠ 5 ಫೈಲ್‌ಗಳು",
    selected: "ಆಯ್ಕೆ ಮಾಡಿದ ದಾಖಲೆಗಳು",
    noFiles: "ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ.",
    pdf: "PDF",
    image: "ಚಿತ್ರ",
    preview: "ಮುನ್ನೋಟ",
    close: "ಮುನ್ನೋಟವನ್ನು ಮುಚ್ಚಿ",
    onlyAllowed: "PDF, JPG ಮತ್ತು PNG ಫೈಲ್‌ಗಳನ್ನು ಮಾತ್ರ ಅನುಮತಿಸಲಾಗಿದೆ.",
    empty: "ಈ ಫೈಲ್ ಖಾಲಿಯಾಗಿದೆ.",
    maxSize: "ಫೈಲ್ ಗಾತ್ರ 10 MB ಅಥವಾ ಅದಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
    maxFiles: "ನೀವು ಗರಿಷ್ಠ 5 ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು.",
    duplicate: "ನಕಲಿ ಫೈಲ್‌ಗಳನ್ನು ಬಿಟ್ಟುಬಿಡಲಾಗಿದೆ.",
    remove: "ತೆಗೆದುಹಾಕಿ",
  },

  ml: {
    title: "മെഡിക്കൽ രേഖകൾ",
    subtitle: "നിങ്ങളുടെ ബന്ധപ്പെട്ട മെഡിക്കൽ റിപ്പോർട്ടുകൾ അപ്‌ലോഡ് ചെയ്യുക.",
    dragDrop: "നിങ്ങളുടെ രേഖകൾ ഇവിടെ വലിച്ചിടുക",
    or: "അല്ലെങ്കിൽ നിങ്ങളുടെ ഉപകരണത്തിൽ നിന്ന് ഫയലുകൾ തിരഞ്ഞെടുക്കുക",
    choose: "രേഖകൾ തിരഞ്ഞെടുക്കുക",
    formats: "PDF, JPG, PNG · ഓരോ ഫയലും പരമാവധി 10 MB · പരമാവധി 5 ഫയലുകൾ",
    selected: "തിരഞ്ഞെടുത്ത രേഖകൾ",
    noFiles: "ഇതുവരെ രേഖകളൊന്നും തിരഞ്ഞെടുത്തിട്ടില്ല.",
    pdf: "PDF",
    image: "ചിത്രം",
    preview: "പ്രിവ്യൂ",
    close: "പ്രിവ്യൂ അടയ്ക്കുക",
    onlyAllowed: "PDF, JPG, PNG ഫയലുകൾ മാത്രമേ അനുവദിക്കൂ.",
    empty: "ഈ ഫയൽ ശൂന്യമാണ്.",
    maxSize: "ഫയലിന്റെ വലുപ്പം 10 MB അല്ലെങ്കിൽ അതിൽ കുറവായിരിക്കണം.",
    maxFiles: "നിങ്ങൾക്ക് പരമാവധി 5 രേഖകൾ അപ്‌ലോഡ് ചെയ്യാം.",
    duplicate: "തനിപ്പകർപ്പ് ഫയലുകൾ ഒഴിവാക്കി.",
    remove: "നീക്കം ചെയ്യുക",
  },

  pa: {
    title: "ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼",
    subtitle: "ਆਪਣੀਆਂ ਸੰਬੰਧਿਤ ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ ਅਪਲੋਡ ਕਰੋ।",
    dragDrop: "ਆਪਣੇ ਦਸਤਾਵੇਜ਼ ਇੱਥੇ ਖਿੱਚ ਕੇ ਛੱਡੋ",
    or: "ਜਾਂ ਆਪਣੇ ਡਿਵਾਈਸ ਤੋਂ ਫਾਈਲਾਂ ਚੁਣੋ",
    choose: "ਦਸਤਾਵੇਜ਼ ਚੁਣੋ",
    formats: "PDF, JPG, PNG · ਹਰੇਕ ਫਾਈਲ ਵੱਧ ਤੋਂ ਵੱਧ 10 MB · ਵੱਧ ਤੋਂ ਵੱਧ 5 ਫਾਈਲਾਂ",
    selected: "ਚੁਣੇ ਗਏ ਦਸਤਾਵੇਜ਼",
    noFiles: "ਅਜੇ ਤੱਕ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਚੁਣਿਆ ਗਿਆ।",
    pdf: "PDF",
    image: "ਤਸਵੀਰ",
    preview: "ਝਲਕ",
    close: "ਝਲਕ ਬੰਦ ਕਰੋ",
    onlyAllowed: "ਸਿਰਫ਼ PDF, JPG ਅਤੇ PNG ਫਾਈਲਾਂ ਦੀ ਇਜਾਜ਼ਤ ਹੈ।",
    empty: "ਇਹ ਫਾਈਲ ਖਾਲੀ ਹੈ।",
    maxSize: "ਫਾਈਲ ਦਾ ਆਕਾਰ 10 MB ਜਾਂ ਇਸ ਤੋਂ ਘੱਟ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
    maxFiles: "ਤੁਸੀਂ ਵੱਧ ਤੋਂ ਵੱਧ 5 ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ ਕਰ ਸਕਦੇ ਹੋ।",
    duplicate: "ਦੁਹਰੀਆਂ ਫਾਈਲਾਂ ਛੱਡ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ।",
    remove: "ਹਟਾਓ",
  },
};

function getFileExtension(fileName) {
  return fileName.split(".").pop().toLowerCase();
}

function isPdf(file) {
  return getFileExtension(file.name) === "pdf";
}

function isImage(file) {
  return ["jpg", "jpeg", "png"].includes(
    getFileExtension(file.name)
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function MedicalDocumentUpload({
  files = [],
  onFilesChange,
  language = "en",
}) {
  const inputRef = useRef(null);

  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const t = translations[language] || translations.en;
console.log("DOCUMENT UPLOAD LANGUAGE:", language);
  // Create and clean up the preview URL.
  useEffect(() => {
    if (!previewFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(previewFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [previewFile]);

  function addFiles(selectedFiles) {
    setError("");

    const incomingFiles = Array.from(selectedFiles || []);
    const validFiles = [];
    const errors = [];

    for (const file of incomingFiles) {
      const extension = getFileExtension(file.name);

      if (!ALLOWED_EXTENSIONS.includes(extension)) {
        errors.push(`${file.name}: ${t.onlyAllowed}`);
        continue;
      }

      if (file.size === 0) {
        errors.push(`${file.name}: ${t.empty}`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: ${t.maxSize}`);
        continue;
      }

      validFiles.push(file);
    }

    // Avoid duplicate files.
    const uniqueFiles = validFiles.filter(
      (file) =>
        !files.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        )
    );

    const remainingSlots = MAX_FILES - files.length;

    const filesToAdd = uniqueFiles.slice(
      0,
      Math.max(0, remainingSlots)
    );

    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd]);
    }

    if (uniqueFiles.length > filesToAdd.length) {
      errors.push(t.maxFiles);
    }

    if (uniqueFiles.length < validFiles.length) {
      errors.push(t.duplicate);
    }

    if (errors.length > 0) {
      setError(errors.join(" "));
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeFile(indexToRemove) {
    onFilesChange(
      files.filter((_, index) => index !== indexToRemove)
    );

    if (previewFile === files[indexToRemove]) {
      setPreviewFile(null);
    }

    setError("");
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function openPreview(file) {
    setPreviewFile(file);
  }

  return (
    <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5 sm:p-6">

      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
          <FileText size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-[#214D43]">
            {t.title}
          </h2>

          <p className="text-sm text-gray-500">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Drag and drop area */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`mt-5 rounded-xl border-2 border-dashed p-6 text-center transition sm:p-8 ${
          isDragging
            ? "border-[#47796E] bg-[#EAF3ED]"
            : "border-[#B9D5C5] bg-white"
        }`}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
          <Upload size={23} />
        </div>

        <h3 className="mt-4 font-semibold text-[#214D43]">
          {t.dragDrop}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {t.or}
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          multiple
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={files.length >= MAX_FILES}
          className="mt-4 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285C50] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.choose}
        </button>

        <p className="mt-3 text-xs text-gray-400">
          {t.formats}
        </p>
      </div>

      {/* Validation errors */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />
          <p>{error}</p>
        </div>
      )}

      {/* Selected documents */}
      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-[#214D43]">
            {t.selected}
          </h3>

          <span className="rounded-full bg-[#E0EEE7] px-3 py-1 text-xs font-medium text-[#315F53]">
            {files.length}/{MAX_FILES} files
          </span>
        </div>

        {files.length === 0 ? (
          <div className="mt-3 rounded-xl border border-[#DCE5DC] bg-white p-5 text-center">
            <FileText
              size={25}
              className="mx-auto text-[#9BAFA4]"
            />

            <p className="mt-2 text-sm text-gray-500">
              {t.noFiles}
            </p>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-[#DCE5DC] bg-white p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
                  {isImage(file) ? (
                    <FileImage size={21} />
                  ) : (
                    <FileCheck2 size={21} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-[#214D43]">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {isPdf(file) ? t.pdf : t.image} ·{" "}
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Preview */}
                <button
                  type="button"
                  onClick={() => openPreview(file)}
                  aria-label={`${t.preview} ${file.name}`}
                  title={t.preview}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#EAF3ED] hover:text-[#326F61]"
                >
                  <Eye size={18} />
                </button>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`${t.remove} ${file.name}`}
                  title={t.remove}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document preview modal */}
      {previewFile && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-4">
              <p className="min-w-0 truncate text-sm font-semibold text-[#214D43]">
                {previewFile.name}
              </p>

              <button
                type="button"
                onClick={() => setPreviewFile(null)}
                aria-label={t.close}
                title={t.close}
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {isImage(previewFile) ? (
              <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-100 p-3">
                <img
                  src={previewUrl}
                  alt={`${t.preview} ${previewFile.name}`}
                  className="max-h-[75vh] max-w-full object-contain"
                />
              </div>
            ) : (
              <iframe
                src={previewUrl}
                title={`${t.preview} ${previewFile.name}`}
                className="h-[75vh] w-full"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
