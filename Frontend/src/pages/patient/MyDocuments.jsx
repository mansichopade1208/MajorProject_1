
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  FileImage,
  File,
  Upload,
  Search,
  Trash2,
  Eye,
  FolderOpen,
  FileCheck2,
  ClipboardList,
  X,
  Plus,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const categories = [
  "All Documents",
  "Lab Reports",
  "Prescriptions",
  "Scans & Images",
  "Other",
];

const categoryOptions = [
  "Lab Reports",
  "Prescriptions",
  "Scans & Images",
  "Other",
];

const translations = {
  en: {
    title: "My Documents",
    description: "Keep your medical reports, prescriptions and health records organized in one place.",
    uploadDocument: "Upload Document",
    totalDocuments: "Total Documents",
    labReports: "Lab Reports",
    prescriptions: "Prescriptions",
    scans: "Scans & Images",
    healthRecordsTitle: "Your health records, all together",
    healthRecordsDescription: "Documents uploaded during consultations are automatically saved here. You can view and manage them from this page.",
    supportedFormats: "Supported formats: PDF, JPG, PNG · Maximum size: 10 MB",
    uploadFile: "Upload a file",
    yourDocuments: "Your Documents",
    manageDescription: "View and manage your uploaded medical records.",
    search: "Search documents...",
    categories: {
      "All Documents": "All Documents",
      "Lab Reports": "Lab Reports",
      "Prescriptions": "Prescriptions",
      "Scans & Images": "Scans & Images",
      Other: "Other",
    },
    loading: "Loading your medical documents...",
    noMatching: "No matching documents found",
    noDocuments: "No documents uploaded yet",
    tryDifferent: "Try a different search term or category.",
    emptyDescription: "Documents uploaded during your consultations will appear here.",
    consultationUpload: "Consultation upload",
    view: "View",
    delete: "Delete",
    viewTitle: "View document",
    deleteTitle: "Delete document",
    privacyTitle: "Your medical records",
    privacyDescription: "Documents are stored on the application server and associated with your account. Access to these documents requires authentication.",
    uploadSubtitle: "Add a medical document to your records.",
    documentCategory: "Document Category",
    chooseFile: "Choose File",
    chooseDocument: "Click to choose a document",
    selected: "Selected",
    close: "Close",
    upload: "Upload",
    closeDialog: "Close upload dialog",
    loginAgain: "Please log in again.",
    loginToView: "Please log in again to view your documents.",
    loadError: "Unable to load your documents.",
    uploadError: "Document upload failed.",
    selectFirst: "Please select a document first.",
    deleteError: "Unable to delete document.",
    openError: "Unable to open document.",
    popupError: "Please allow pop-ups to view your document.",
    confirmDelete: "Are you sure you want to permanently delete this document?",
    pdfError: "Please upload a PDF, JPG or PNG file.",
    sizeError: "File size must be less than 10 MB.",
  },

  hi: {
    title: "मेरे दस्तावेज़",
    description: "अपनी मेडिकल रिपोर्ट, प्रिस्क्रिप्शन और स्वास्थ्य रिकॉर्ड एक ही जगह व्यवस्थित रखें।",
    uploadDocument: "दस्तावेज़ अपलोड करें",
    totalDocuments: "कुल दस्तावेज़",
    labReports: "लैब रिपोर्ट",
    prescriptions: "प्रिस्क्रिप्शन",
    scans: "स्कैन और इमेज",
    healthRecordsTitle: "आपके सभी स्वास्थ्य रिकॉर्ड एक जगह",
    healthRecordsDescription: "परामर्श के दौरान अपलोड किए गए दस्तावेज़ यहाँ अपने आप सेव हो जाते हैं। आप इन्हें यहाँ देख और मैनेज कर सकते हैं।",
    supportedFormats: "समर्थित फॉर्मेट: PDF, JPG, PNG · अधिकतम आकार: 10 MB",
    uploadFile: "फ़ाइल अपलोड करें",
    yourDocuments: "आपके दस्तावेज़",
    manageDescription: "अपने अपलोड किए गए मेडिकल रिकॉर्ड देखें और मैनेज करें।",
    search: "दस्तावेज़ खोजें...",
    categories: {
      "All Documents": "सभी दस्तावेज़",
      "Lab Reports": "लैब रिपोर्ट",
      Prescriptions: "प्रिस्क्रिप्शन",
      "Scans & Images": "स्कैन और इमेज",
      Other: "अन्य",
    },
    loading: "आपके मेडिकल दस्तावेज़ लोड हो रहे हैं...",
    noMatching: "कोई मिलता-जुलता दस्तावेज़ नहीं मिला",
    noDocuments: "अभी तक कोई दस्तावेज़ अपलोड नहीं किया गया",
    tryDifferent: "कोई दूसरा शब्द या श्रेणी खोजें।",
    emptyDescription: "परामर्श के दौरान अपलोड किए गए दस्तावेज़ यहाँ दिखाई देंगे।",
    consultationUpload: "परामर्श के दौरान अपलोड किया गया",
    view: "देखें",
    delete: "हटाएँ",
    viewTitle: "दस्तावेज़ देखें",
    deleteTitle: "दस्तावेज़ हटाएँ",
    privacyTitle: "आपके मेडिकल रिकॉर्ड",
    privacyDescription: "दस्तावेज़ एप्लिकेशन सर्वर पर आपके खाते से जुड़े हुए सुरक्षित रखे जाते हैं। इन दस्तावेज़ों को देखने के लिए लॉगिन आवश्यक है।",
    uploadSubtitle: "अपने रिकॉर्ड में मेडिकल दस्तावेज़ जोड़ें।",
    documentCategory: "दस्तावेज़ की श्रेणी",
    chooseFile: "फ़ाइल चुनें",
    chooseDocument: "दस्तावेज़ चुनने के लिए क्लिक करें",
    selected: "चयनित",
    close: "बंद करें",
    upload: "अपलोड करें",
    closeDialog: "अपलोड विंडो बंद करें",
    loginAgain: "कृपया दोबारा लॉगिन करें।",
    loginToView: "अपने दस्तावेज़ देखने के लिए कृपया दोबारा लॉगिन करें।",
    loadError: "आपके दस्तावेज़ लोड नहीं हो सके।",
    uploadError: "दस्तावेज़ अपलोड नहीं हो सका।",
    selectFirst: "कृपया पहले कोई दस्तावेज़ चुनें।",
    deleteError: "दस्तावेज़ हटाया नहीं जा सका।",
    openError: "दस्तावेज़ नहीं खुल सका।",
    popupError: "दस्तावेज़ देखने के लिए पॉप-अप की अनुमति दें।",
    confirmDelete: "क्या आप वाकई इस दस्तावेज़ को स्थायी रूप से हटाना चाहते हैं?",
    pdfError: "कृपया PDF, JPG या PNG फ़ाइल अपलोड करें।",
    sizeError: "फ़ाइल का आकार 10 MB से कम होना चाहिए।",
  },

  gu: {
    title: "મારા દસ્તાવેજો",
    description: "તમારા મેડિકલ રિપોર્ટ, પ્રિસ્ક્રિપ્શન અને આરોગ્ય રેકોર્ડ એક જ જગ્યાએ વ્યવસ્થિત રાખો.",
    uploadDocument: "દસ્તાવેજ અપલોડ કરો",
    totalDocuments: "કુલ દસ્તાવેજો",
    labReports: "લેબ રિપોર્ટ",
    prescriptions: "પ્રિસ્ક્રિપ્શન",
    scans: "સ્કેન અને છબીઓ",
    healthRecordsTitle: "તમારા બધા આરોગ્ય રેકોર્ડ એક જ જગ્યાએ",
    healthRecordsDescription: "કન્સલ્ટેશન દરમિયાન અપલોડ કરેલા દસ્તાવેજો અહીં આપમેળે સેવ થાય છે. તમે અહીંથી તેમને જોઈ અને મેનેજ કરી શકો છો.",
    supportedFormats: "સપોર્ટેડ ફોર્મેટ: PDF, JPG, PNG · મહત્તમ કદ: 10 MB",
    uploadFile: "ફાઇલ અપલોડ કરો",
    yourDocuments: "તમારા દસ્તાવેજો",
    manageDescription: "તમારા અપલોડ કરેલા મેડિકલ રેકોર્ડ જુઓ અને મેનેજ કરો.",
    search: "દસ્તાવેજો શોધો...",
    categories: {
      "All Documents": "બધા દસ્તાવેજો",
      "Lab Reports": "લેબ રિપોર્ટ",
      Prescriptions: "પ્રિસ્ક્રિપ્શન",
      "Scans & Images": "સ્કેન અને છબીઓ",
      Other: "અન્ય",
    },
    loading: "તમારા મેડિકલ દસ્તાવેજો લોડ થઈ રહ્યા છે...",
    noMatching: "મળતા દસ્તાવેજો મળ્યા નથી",
    noDocuments: "હજુ સુધી કોઈ દસ્તાવેજ અપલોડ કર્યો નથી",
    tryDifferent: "બીજો શબ્દ અથવા કેટેગરી અજમાવો.",
    emptyDescription: "કન્સલ્ટેશન દરમિયાન અપલોડ કરેલા દસ્તાવેજો અહીં દેખાશે.",
    consultationUpload: "કન્સલ્ટેશન દરમિયાન અપલોડ કરેલ",
    view: "જુઓ",
    delete: "કાઢી નાખો",
    viewTitle: "દસ્તાવેજ જુઓ",
    deleteTitle: "દસ્તાવેજ કાઢી નાખો",
    privacyTitle: "તમારા મેડિકલ રેકોર્ડ",
    privacyDescription: "દસ્તાવેજો એપ્લિકેશન સર્વર પર તમારા એકાઉન્ટ સાથે સુરક્ષિત રીતે સંગ્રહિત થાય છે. આ દસ્તાવેજો જોવા માટે લૉગિન જરૂરી છે.",
    uploadSubtitle: "તમારા રેકોર્ડમાં મેડિકલ દસ્તાવેજ ઉમેરો.",
    documentCategory: "દસ્તાવેજની કેટેગરી",
    chooseFile: "ફાઇલ પસંદ કરો",
    chooseDocument: "દસ્તાવેજ પસંદ કરવા ક્લિક કરો",
    selected: "પસંદ કરેલ",
    close: "બંધ કરો",
    upload: "અપલોડ કરો",
    closeDialog: "અપલોડ વિન્ડો બંધ કરો",
    loginAgain: "કૃપા કરીને ફરીથી લૉગિન કરો.",
    loginToView: "તમારા દસ્તાવેજો જોવા માટે કૃપા કરીને ફરીથી લૉગિન કરો.",
    loadError: "તમારા દસ્તાવેજો લોડ થઈ શક્યા નથી.",
    uploadError: "દસ્તાવેજ અપલોડ થઈ શક્યો નથી.",
    selectFirst: "કૃપા કરીને પહેલા દસ્તાવેજ પસંદ કરો.",
    deleteError: "દસ્તાવેજ કાઢી શકાતો નથી.",
    openError: "દસ્તાવેજ ખોલી શકાતો નથી.",
    popupError: "દસ્તાવેજ જોવા માટે પોપ-અપની મંજૂરી આપો.",
    confirmDelete: "શું તમે ખરેખર આ દસ્તાવેજ કાયમી રીતે કાઢી નાખવા માંગો છો?",
    pdfError: "કૃપા કરીને PDF, JPG અથવા PNG ફાઇલ અપલોડ કરો.",
    sizeError: "ફાઇલનું કદ 10 MB કરતાં ઓછું હોવું જોઈએ.",
  },

  mr: {
    title: "माझे दस्तऐवज",
    description: "तुमचे वैद्यकीय अहवाल, प्रिस्क्रिप्शन आणि आरोग्य नोंदी एकाच ठिकाणी व्यवस्थित ठेवा.",
    uploadDocument: "दस्तऐवज अपलोड करा",
    totalDocuments: "एकूण दस्तऐवज",
    labReports: "लॅब रिपोर्ट",
    prescriptions: "प्रिस्क्रिप्शन",
    scans: "स्कॅन आणि प्रतिमा",
    healthRecordsTitle: "तुमच्या सर्व आरोग्य नोंदी एकाच ठिकाणी",
    healthRecordsDescription: "सल्लामसलत दरम्यान अपलोड केलेले दस्तऐवज येथे आपोआप सेव्ह होतात. तुम्ही ते येथे पाहू आणि व्यवस्थापित करू शकता.",
    supportedFormats: "समर्थित फॉरमॅट: PDF, JPG, PNG · कमाल आकार: 10 MB",
    uploadFile: "फाइल अपलोड करा",
    yourDocuments: "तुमचे दस्तऐवज",
    manageDescription: "तुमचे अपलोड केलेले वैद्यकीय रेकॉर्ड पहा आणि व्यवस्थापित करा.",
    search: "दस्तऐवज शोधा...",
    categories: {
      "All Documents": "सर्व दस्तऐवज",
      "Lab Reports": "लॅब रिपोर्ट",
      Prescriptions: "प्रिस्क्रिप्शन",
      "Scans & Images": "स्कॅन आणि प्रतिमा",
      Other: "इतर",
    },
    loading: "तुमचे वैद्यकीय दस्तऐवज लोड होत आहेत...",
    noMatching: "जुळणारे दस्तऐवज सापडले नाहीत",
    noDocuments: "अद्याप कोणताही दस्तऐवज अपलोड केलेला नाही",
    tryDifferent: "वेगळा शब्द किंवा श्रेणी वापरून पाहा.",
    emptyDescription: "सल्लामसलत दरम्यान अपलोड केलेले दस्तऐवज येथे दिसतील.",
    consultationUpload: "सल्लामसलत दरम्यान अपलोड केलेले",
    view: "पहा",
    delete: "हटवा",
    viewTitle: "दस्तऐवज पहा",
    deleteTitle: "दस्तऐवज हटवा",
    privacyTitle: "तुमचे वैद्यकीय रेकॉर्ड",
    privacyDescription: "दस्तऐवज अॅप्लिकेशन सर्व्हरवर तुमच्या खात्याशी सुरक्षितपणे जोडलेले असतात. हे दस्तऐवज पाहण्यासाठी लॉगिन आवश्यक आहे.",
    uploadSubtitle: "तुमच्या रेकॉर्डमध्ये वैद्यकीय दस्तऐवज जोडा.",
    documentCategory: "दस्तऐवजाची श्रेणी",
    chooseFile: "फाइल निवडा",
    chooseDocument: "दस्तऐवज निवडण्यासाठी क्लिक करा",
    selected: "निवडलेले",
    close: "बंद करा",
    upload: "अपलोड करा",
    closeDialog: "अपलोड विंडो बंद करा",
    loginAgain: "कृपया पुन्हा लॉगिन करा.",
    loginToView: "तुमचे दस्तऐवज पाहण्यासाठी कृपया पुन्हा लॉगिन करा.",
    loadError: "तुमचे दस्तऐवज लोड करता आले नाहीत.",
    uploadError: "दस्तऐवज अपलोड करता आला नाही.",
    selectFirst: "कृपया प्रथम दस्तऐवज निवडा.",
    deleteError: "दस्तऐवज हटवता आला नाही.",
    openError: "दस्तऐवज उघडता आला नाही.",
    popupError: "दस्तऐवज पाहण्यासाठी पॉप-अपला परवानगी द्या.",
    confirmDelete: "तुम्हाला हा दस्तऐवज कायमचा हटवायचा आहे का?",
    pdfError: "कृपया PDF, JPG किंवा PNG फाइल अपलोड करा.",
    sizeError: "फाइलचा आकार 10 MB पेक्षा कमी असावा.",
  },

  bn: {
    title: "আমার নথিপত্র",
    description: "আপনার মেডিকেল রিপোর্ট, প্রেসক্রিপশন এবং স্বাস্থ্য সংক্রান্ত নথি এক জায়গায় রাখুন।",
    uploadDocument: "নথি আপলোড করুন",
    totalDocuments: "মোট নথি",
    labReports: "ল্যাব রিপোর্ট",
    prescriptions: "প্রেসক্রিপশন",
    scans: "স্ক্যান ও ছবি",
    healthRecordsTitle: "আপনার সমস্ত স্বাস্থ্য নথি এক জায়গায়",
    healthRecordsDescription: "পরামর্শের সময় আপলোড করা নথিগুলি এখানে স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়। আপনি এখান থেকে সেগুলি দেখতে ও পরিচালনা করতে পারেন।",
    supportedFormats: "সমর্থিত ফরম্যাট: PDF, JPG, PNG · সর্বোচ্চ আকার: 10 MB",
    uploadFile: "ফাইল আপলোড করুন",
    yourDocuments: "আপনার নথিপত্র",
    manageDescription: "আপনার আপলোড করা মেডিকেল নথিগুলি দেখুন ও পরিচালনা করুন।",
    search: "নথি খুঁজুন...",
    categories: {
      "All Documents": "সমস্ত নথি",
      "Lab Reports": "ল্যাব রিপোর্ট",
      Prescriptions: "প্রেসক্রিপশন",
      "Scans & Images": "স্ক্যান ও ছবি",
      Other: "অন্যান্য",
    },
    loading: "আপনার মেডিকেল নথি লোড হচ্ছে...",
    noMatching: "কোনো মিলযুক্ত নথি পাওয়া যায়নি",
    noDocuments: "এখনও কোনো নথি আপলোড করা হয়নি",
    tryDifferent: "অন্য কোনো শব্দ বা বিভাগ দিয়ে খুঁজুন।",
    emptyDescription: "পরামর্শের সময় আপলোড করা নথিগুলি এখানে দেখা যাবে।",
    consultationUpload: "পরামর্শের সময় আপলোড করা",
    view: "দেখুন",
    delete: "মুছুন",
    viewTitle: "নথি দেখুন",
    deleteTitle: "নথি মুছুন",
    privacyTitle: "আপনার মেডিকেল রেকর্ড",
    privacyDescription: "নথিগুলি অ্যাপ্লিকেশন সার্ভারে আপনার অ্যাকাউন্টের সঙ্গে নিরাপদে সংরক্ষিত থাকে। এই নথিগুলি দেখতে লগইন করা প্রয়োজন।",
    uploadSubtitle: "আপনার রেকর্ডে একটি মেডিকেল নথি যোগ করুন।",
    documentCategory: "নথির বিভাগ",
    chooseFile: "ফাইল নির্বাচন করুন",
    chooseDocument: "নথি নির্বাচন করতে ক্লিক করুন",
    selected: "নির্বাচিত",
    close: "বন্ধ করুন",
    upload: "আপলোড করুন",
    closeDialog: "আপলোড উইন্ডো বন্ধ করুন",
    loginAgain: "অনুগ্রহ করে আবার লগইন করুন।",
    loginToView: "আপনার নথি দেখতে অনুগ্রহ করে আবার লগইন করুন।",
    loadError: "আপনার নথি লোড করা যায়নি।",
    uploadError: "নথি আপলোড করা যায়নি।",
    selectFirst: "অনুগ্রহ করে প্রথমে একটি নথি নির্বাচন করুন।",
    deleteError: "নথি মুছে ফেলা যায়নি।",
    openError: "নথি খোলা যায়নি।",
    popupError: "নথি দেখতে পপ-আপের অনুমতি দিন।",
    confirmDelete: "আপনি কি নিশ্চিত যে এই নথিটি স্থায়ীভাবে মুছে ফেলতে চান?",
    pdfError: "অনুগ্রহ করে PDF, JPG বা PNG ফাইল আপলোড করুন।",
    sizeError: "ফাইলের আকার 10 MB-এর কম হতে হবে।",
  },

  ta: {
    title: "எனது ஆவணங்கள்",
    description: "உங்கள் மருத்துவ அறிக்கைகள், மருந்துச் சீட்டுகள் மற்றும் சுகாதாரப் பதிவுகளை ஒரே இடத்தில் ஒழுங்குபடுத்துங்கள்.",
    uploadDocument: "ஆவணத்தைப் பதிவேற்றவும்",
    totalDocuments: "மொத்த ஆவணங்கள்",
    labReports: "ஆய்வக அறிக்கைகள்",
    prescriptions: "மருந்துச் சீட்டுகள்",
    scans: "ஸ்கேன் மற்றும் படங்கள்",
    healthRecordsTitle: "உங்கள் அனைத்து சுகாதாரப் பதிவுகளும் ஒரே இடத்தில்",
    healthRecordsDescription: "ஆலோசனையின் போது பதிவேற்றப்படும் ஆவணங்கள் இங்கே தானாகவே சேமிக்கப்படும். அவற்றை இங்கே பார்க்கவும் நிர்வகிக்கவும் முடியும்.",
    supportedFormats: "ஆதரிக்கப்படும் வடிவங்கள்: PDF, JPG, PNG · அதிகபட்ச அளவு: 10 MB",
    uploadFile: "கோப்பைப் பதிவேற்றவும்",
    yourDocuments: "உங்கள் ஆவணங்கள்",
    manageDescription: "நீங்கள் பதிவேற்றிய மருத்துவப் பதிவுகளைப் பார்க்கவும் நிர்வகிக்கவும்.",
    search: "ஆவணங்களைத் தேடுங்கள்...",
    categories: {
      "All Documents": "அனைத்து ஆவணங்கள்",
      "Lab Reports": "ஆய்வக அறிக்கைகள்",
      Prescriptions: "மருந்துச் சீட்டுகள்",
      "Scans & Images": "ஸ்கேன் மற்றும் படங்கள்",
      Other: "மற்றவை",
    },
    loading: "உங்கள் மருத்துவ ஆவணங்கள் ஏற்றப்படுகின்றன...",
    noMatching: "பொருந்தும் ஆவணங்கள் எதுவும் இல்லை",
    noDocuments: "இதுவரை ஆவணங்கள் பதிவேற்றப்படவில்லை",
    tryDifferent: "வேறு தேடல் சொல் அல்லது வகையை முயற்சிக்கவும்.",
    emptyDescription: "ஆலோசனையின் போது பதிவேற்றப்பட்ட ஆவணங்கள் இங்கே தோன்றும்.",
    consultationUpload: "ஆலோசனையின் போது பதிவேற்றப்பட்டது",
    view: "பார்க்க",
    delete: "நீக்கு",
    viewTitle: "ஆவணத்தைப் பார்க்கவும்",
    deleteTitle: "ஆவணத்தை நீக்கவும்",
    privacyTitle: "உங்கள் மருத்துவப் பதிவுகள்",
    privacyDescription: "ஆவணங்கள் பயன்பாட்டு சேவையகத்தில் உங்கள் கணக்குடன் பாதுகாப்பாகச் சேமிக்கப்படுகின்றன. அவற்றைப் பார்க்க உள்நுழைவு அவசியம்.",
    uploadSubtitle: "உங்கள் பதிவுகளில் மருத்துவ ஆவணத்தைச் சேர்க்கவும்.",
    documentCategory: "ஆவண வகை",
    chooseFile: "கோப்பைத் தேர்ந்தெடுக்கவும்",
    chooseDocument: "ஆவணத்தைத் தேர்ந்தெடுக்க கிளிக் செய்யவும்",
    selected: "தேர்ந்தெடுக்கப்பட்டது",
    close: "மூடு",
    upload: "பதிவேற்றவும்",
    closeDialog: "பதிவேற்ற சாளரத்தை மூடவும்",
    loginAgain: "மீண்டும் உள்நுழையவும்.",
    loginToView: "உங்கள் ஆவணங்களைப் பார்க்க மீண்டும் உள்நுழையவும்.",
    loadError: "உங்கள் ஆவணங்களை ஏற்ற முடியவில்லை.",
    uploadError: "ஆவணத்தைப் பதிவேற்ற முடியவில்லை.",
    selectFirst: "முதலில் ஒரு ஆவணத்தைத் தேர்ந்தெடுக்கவும்.",
    deleteError: "ஆவணத்தை நீக்க முடியவில்லை.",
    openError: "ஆவணத்தைத் திறக்க முடியவில்லை.",
    popupError: "ஆவணத்தைப் பார்க்க பாப்-அப்களை அனுமதிக்கவும்.",
    confirmDelete: "இந்த ஆவணத்தை நிரந்தரமாக நீக்க விரும்புகிறீர்களா?",
    pdfError: "PDF, JPG அல்லது PNG கோப்பைப் பதிவேற்றவும்.",
    sizeError: "கோப்பின் அளவு 10 MB-க்கும் குறைவாக இருக்க வேண்டும்.",
  },

  te: {
    title: "నా పత్రాలు",
    description: "మీ వైద్య నివేదికలు, ప్రిస్క్రిప్షన్లు మరియు ఆరోగ్య రికార్డులను ఒకే చోట క్రమబద్ధంగా ఉంచండి.",
    uploadDocument: "పత్రాన్ని అప్‌లోడ్ చేయండి",
    totalDocuments: "మొత్తం పత్రాలు",
    labReports: "ల్యాబ్ నివేదికలు",
    prescriptions: "ప్రిస్క్రిప్షన్లు",
    scans: "స్కాన్లు మరియు చిత్రాలు",
    healthRecordsTitle: "మీ ఆరోగ్య రికార్డులన్నీ ఒకే చోట",
    healthRecordsDescription: "సంప్రదింపుల సమయంలో అప్‌లోడ్ చేసిన పత్రాలు ఇక్కడ స్వయంచాలకంగా సేవ్ అవుతాయి. మీరు వాటిని ఇక్కడ చూడవచ్చు మరియు నిర్వహించవచ్చు.",
    supportedFormats: "మద్దతు ఉన్న ఫార్మాట్‌లు: PDF, JPG, PNG · గరిష్ట పరిమాణం: 10 MB",
    uploadFile: "ఫైల్ అప్‌లోడ్ చేయండి",
    yourDocuments: "మీ పత్రాలు",
    manageDescription: "మీరు అప్‌లోడ్ చేసిన వైద్య రికార్డులను చూడండి మరియు నిర్వహించండి.",
    search: "పత్రాలను వెతకండి...",
    categories: {
      "All Documents": "అన్ని పత్రాలు",
      "Lab Reports": "ల్యాబ్ నివేదికలు",
      Prescriptions: "ప్రిస్క్రిప్షన్లు",
      "Scans & Images": "స్కాన్లు మరియు చిత్రాలు",
      Other: "ఇతరాలు",
    },
    loading: "మీ వైద్య పత్రాలు లోడ్ అవుతున్నాయి...",
    noMatching: "సరిపోలే పత్రాలు కనుగొనబడలేదు",
    noDocuments: "ఇంకా ఎలాంటి పత్రాలు అప్‌లోడ్ చేయలేదు",
    tryDifferent: "వేరే పదం లేదా వర్గాన్ని ప్రయత్నించండి.",
    emptyDescription: "సంప్రదింపుల సమయంలో అప్‌లోడ్ చేసిన పత్రాలు ఇక్కడ కనిపిస్తాయి.",
    consultationUpload: "సంప్రదింపుల సమయంలో అప్‌లోడ్ చేయబడింది",
    view: "చూడండి",
    delete: "తొలగించండి",
    viewTitle: "పత్రాన్ని చూడండి",
    deleteTitle: "పత్రాన్ని తొలగించండి",
    privacyTitle: "మీ వైద్య రికార్డులు",
    privacyDescription: "పత్రాలు అప్లికేషన్ సర్వర్‌లో మీ ఖాతాతో సురక్షితంగా నిల్వ చేయబడతాయి. వాటిని చూడటానికి లాగిన్ అవసరం.",
    uploadSubtitle: "మీ రికార్డులకు వైద్య పత్రాన్ని జోడించండి.",
    documentCategory: "పత్రం వర్గం",
    chooseFile: "ఫైల్ ఎంచుకోండి",
    chooseDocument: "పత్రాన్ని ఎంచుకోవడానికి క్లిక్ చేయండి",
    selected: "ఎంచుకున్నది",
    close: "మూసివేయండి",
    upload: "అప్‌లోడ్ చేయండి",
    closeDialog: "అప్‌లోడ్ విండోను మూసివేయండి",
    loginAgain: "దయచేసి మళ్లీ లాగిన్ చేయండి.",
    loginToView: "మీ పత్రాలను చూడటానికి మళ్లీ లాగిన్ చేయండి.",
    loadError: "మీ పత్రాలను లోడ్ చేయలేకపోయాము.",
    uploadError: "పత్రాన్ని అప్‌లోడ్ చేయలేకపోయాము.",
    selectFirst: "దయచేసి ముందుగా ఒక పత్రాన్ని ఎంచుకోండి.",
    deleteError: "పత్రాన్ని తొలగించలేకపోయాము.",
    openError: "పత్రాన్ని తెరవలేకపోయాము.",
    popupError: "పత్రాన్ని చూడటానికి పాప్-అప్‌లను అనుమతించండి.",
    confirmDelete: "ఈ పత్రాన్ని శాశ్వతంగా తొలగించాలనుకుంటున్నారా?",
    pdfError: "దయచేసి PDF, JPG లేదా PNG ఫైల్‌ను అప్‌లోడ్ చేయండి.",
    sizeError: "ఫైల్ పరిమాణం 10 MB కంటే తక్కువగా ఉండాలి.",
  },

  kn: {
    title: "ನನ್ನ ದಾಖಲೆಗಳು",
    description: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ವರದಿಗಳು, ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು ಮತ್ತು ಆರೋಗ್ಯ ದಾಖಲೆಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ವ್ಯವಸ್ಥಿತವಾಗಿ ಇರಿಸಿ.",
    uploadDocument: "ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    totalDocuments: "ಒಟ್ಟು ದಾಖಲೆಗಳು",
    labReports: "ಲ್ಯಾಬ್ ವರದಿಗಳು",
    prescriptions: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು",
    scans: "ಸ್ಕ್ಯಾನ್‌ಗಳು ಮತ್ತು ಚಿತ್ರಗಳು",
    healthRecordsTitle: "ನಿಮ್ಮ ಎಲ್ಲಾ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ",
    healthRecordsDescription: "ಸಮಾಲೋಚನೆಯ ಸಮಯದಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು ಇಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಉಳಿಸಲ್ಪಡುತ್ತವೆ. ನೀವು ಅವುಗಳನ್ನು ಇಲ್ಲಿ ವೀಕ್ಷಿಸಬಹುದು ಮತ್ತು ನಿರ್ವಹಿಸಬಹುದು.",
    supportedFormats: "ಬೆಂಬಲಿತ ಸ್ವರೂಪಗಳು: PDF, JPG, PNG · ಗರಿಷ್ಠ ಗಾತ್ರ: 10 MB",
    uploadFile: "ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    yourDocuments: "ನಿಮ್ಮ ದಾಖಲೆಗಳು",
    manageDescription: "ನೀವು ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.",
    search: "ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ...",
    categories: {
      "All Documents": "ಎಲ್ಲಾ ದಾಖಲೆಗಳು",
      "Lab Reports": "ಲ್ಯಾಬ್ ವರದಿಗಳು",
      Prescriptions: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು",
      "Scans & Images": "ಸ್ಕ್ಯಾನ್‌ಗಳು ಮತ್ತು ಚಿತ್ರಗಳು",
      Other: "ಇತರೆ",
    },
    loading: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    noMatching: "ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    noDocuments: "ಇನ್ನೂ ಯಾವುದೇ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿಲ್ಲ",
    tryDifferent: "ಬೇರೆ ಹುಡುಕಾಟ ಪದ ಅಥವಾ ವರ್ಗವನ್ನು ಪ್ರಯತ್ನಿಸಿ.",
    emptyDescription: "ಸಮಾಲೋಚನೆಯ ಸಮಯದಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ದಾಖಲೆಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.",
    consultationUpload: "ಸಮಾಲೋಚನೆಯ ಸಮಯದಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ",
    view: "ವೀಕ್ಷಿಸಿ",
    delete: "ಅಳಿಸಿ",
    viewTitle: "ದಾಖಲೆಯನ್ನು ವೀಕ್ಷಿಸಿ",
    deleteTitle: "ದಾಖಲೆಯನ್ನು ಅಳಿಸಿ",
    privacyTitle: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    privacyDescription: "ದಾಖಲೆಗಳನ್ನು ಅಪ್ಲಿಕೇಶನ್ ಸರ್ವರ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಖಾತೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ. ಅವುಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ.",
    uploadSubtitle: "ನಿಮ್ಮ ದಾಖಲೆಗಳಿಗೆ ವೈದ್ಯಕೀಯ ದಾಖಲೆಯನ್ನು ಸೇರಿಸಿ.",
    documentCategory: "ದಾಖಲೆಯ ವರ್ಗ",
    chooseFile: "ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",
    chooseDocument: "ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
    selected: "ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ",
    close: "ಮುಚ್ಚಿ",
    upload: "ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    closeDialog: "ಅಪ್‌ಲೋಡ್ ವಿಂಡೋವನ್ನು ಮುಚ್ಚಿ",
    loginAgain: "ದಯವಿಟ್ಟು ಮತ್ತೆ ಲಾಗಿನ್ ಮಾಡಿ.",
    loginToView: "ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮತ್ತೆ ಲಾಗಿನ್ ಮಾಡಿ.",
    loadError: "ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    uploadError: "ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    selectFirst: "ದಯವಿಟ್ಟು ಮೊದಲು ಒಂದು ದಾಖಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    deleteError: "ದಾಖಲೆಯನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    openError: "ದಾಖಲೆಯನ್ನು ತೆರೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    popupError: "ದಾಖಲೆಯನ್ನು ವೀಕ್ಷಿಸಲು ಪಾಪ್-ಅಪ್‌ಗಳನ್ನು ಅನುಮತಿಸಿ.",
    confirmDelete: "ಈ ದಾಖಲೆಯನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",
    pdfError: "ದಯವಿಟ್ಟು PDF, JPG ಅಥವಾ PNG ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    sizeError: "ಫೈಲ್ ಗಾತ್ರವು 10 MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
  },

  ml: {
    title: "എന്റെ രേഖകൾ",
    description: "നിങ്ങളുടെ മെഡിക്കൽ റിപ്പോർട്ടുകൾ, പ്രിസ്ക്രിപ്ഷനുകൾ, ആരോഗ്യ രേഖകൾ എന്നിവ ഒരിടത്ത് ക്രമീകരിക്കുക.",
    uploadDocument: "രേഖ അപ്‌ലോഡ് ചെയ്യുക",
    totalDocuments: "ആകെ രേഖകൾ",
    labReports: "ലാബ് റിപ്പോർട്ടുകൾ",
    prescriptions: "പ്രിസ്ക്രിപ്ഷനുകൾ",
    scans: "സ്കാനുകളും ചിത്രങ്ങളും",
    healthRecordsTitle: "നിങ്ങളുടെ എല്ലാ ആരോഗ്യ രേഖകളും ഒരിടത്ത്",
    healthRecordsDescription: "കൺസൾട്ടേഷൻ സമയത്ത് അപ്‌ലോഡ് ചെയ്യുന്ന രേഖകൾ ഇവിടെ സ്വയമേവ സംരക്ഷിക്കപ്പെടും. നിങ്ങൾക്ക് അവ ഇവിടെ കാണാനും നിയന്ത്രിക്കാനും കഴിയും.",
    supportedFormats: "പിന്തുണയ്ക്കുന്ന ഫോർമാറ്റുകൾ: PDF, JPG, PNG · പരമാവധി വലുപ്പം: 10 MB",
    uploadFile: "ഫയൽ അപ്‌ലോഡ് ചെയ്യുക",
    yourDocuments: "നിങ്ങളുടെ രേഖകൾ",
    manageDescription: "നിങ്ങൾ അപ്‌ലോഡ് ചെയ്ത മെഡിക്കൽ രേഖകൾ കാണുകയും നിയന്ത്രിക്കുകയും ചെയ്യുക.",
    search: "രേഖകൾ തിരയുക...",
    categories: {
      "All Documents": "എല്ലാ രേഖകളും",
      "Lab Reports": "ലാബ് റിപ്പോർട്ടുകൾ",
      Prescriptions: "പ്രിസ്ക്രിപ്ഷനുകൾ",
      "Scans & Images": "സ്കാനുകളും ചിത്രങ്ങളും",
      Other: "മറ്റുള്ളവ",
    },
    loading: "നിങ്ങളുടെ മെഡിക്കൽ രേഖകൾ ലോഡ് ചെയ്യുന്നു...",
    noMatching: "പൊരുത്തപ്പെടുന്ന രേഖകളൊന്നും കണ്ടെത്തിയില്ല",
    noDocuments: "ഇതുവരെ രേഖകളൊന്നും അപ്‌ലോഡ് ചെയ്തിട്ടില്ല",
    tryDifferent: "മറ്റൊരു തിരയൽ വാക്കോ വിഭാഗമോ പരീക്ഷിക്കുക.",
    emptyDescription: "കൺസൾട്ടേഷൻ സമയത്ത് അപ്‌ലോഡ് ചെയ്ത രേഖകൾ ഇവിടെ കാണിക്കും.",
    consultationUpload: "കൺസൾട്ടേഷൻ സമയത്ത് അപ്‌ലോഡ് ചെയ്തത്",
    view: "കാണുക",
    delete: "നീക്കം ചെയ്യുക",
    viewTitle: "രേഖ കാണുക",
    deleteTitle: "രേഖ നീക്കം ചെയ്യുക",
    privacyTitle: "നിങ്ങളുടെ മെഡിക്കൽ രേഖകൾ",
    privacyDescription: "രേഖകൾ ആപ്ലിക്കേഷൻ സെർവറിൽ നിങ്ങളുടെ അക്കൗണ്ടുമായി സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു. അവ കാണാൻ ലോഗിൻ ആവശ്യമാണ്.",
    uploadSubtitle: "നിങ്ങളുടെ രേഖകളിലേക്ക് ഒരു മെഡിക്കൽ രേഖ ചേർക്കുക.",
    documentCategory: "രേഖയുടെ വിഭാഗം",
    chooseFile: "ഫയൽ തിരഞ്ഞെടുക്കുക",
    chooseDocument: "രേഖ തിരഞ്ഞെടുക്കാൻ ക്ലിക്ക് ചെയ്യുക",
    selected: "തിരഞ്ഞെടുത്തത്",
    close: "അടയ്ക്കുക",
    upload: "അപ്‌ലോഡ് ചെയ്യുക",
    closeDialog: "അപ്‌ലോഡ് വിൻഡോ അടയ്ക്കുക",
    loginAgain: "ദയവായി വീണ്ടും ലോഗിൻ ചെയ്യുക.",
    loginToView: "നിങ്ങളുടെ രേഖകൾ കാണാൻ വീണ്ടും ലോഗിൻ ചെയ്യുക.",
    loadError: "നിങ്ങളുടെ രേഖകൾ ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.",
    uploadError: "രേഖ അപ്‌ലോഡ് ചെയ്യാൻ കഴിഞ്ഞില്ല.",
    selectFirst: "ദയവായി ആദ്യം ഒരു രേഖ തിരഞ്ഞെടുക്കുക.",
    deleteError: "രേഖ നീക്കം ചെയ്യാൻ കഴിഞ്ഞില്ല.",
    openError: "രേഖ തുറക്കാൻ കഴിഞ്ഞില്ല.",
    popupError: "രേഖ കാണാൻ പോപ്പ്-അപ്പുകൾ അനുവദിക്കുക.",
    confirmDelete: "ഈ രേഖ സ്ഥിരമായി നീക്കം ചെയ്യണമെന്ന് നിങ്ങൾക്ക് ഉറപ്പാണോ?",
    pdfError: "ദയവായി PDF, JPG അല്ലെങ്കിൽ PNG ഫയൽ അപ്‌ലോഡ് ചെയ്യുക.",
    sizeError: "ഫയലിന്റെ വലുപ്പം 10 MB-ൽ കുറവായിരിക്കണം.",
  },

  pa: {
    title: "ਮੇਰੇ ਦਸਤਾਵੇਜ਼",
    description: "ਆਪਣੀਆਂ ਮੈਡੀਕਲ ਰਿਪੋਰਟਾਂ, ਨੁਸਖ਼ੇ ਅਤੇ ਸਿਹਤ ਰਿਕਾਰਡ ਇੱਕੋ ਥਾਂ 'ਤੇ ਵਿਵਸਥਿਤ ਰੱਖੋ।",
    uploadDocument: "ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਕਰੋ",
    totalDocuments: "ਕੁੱਲ ਦਸਤਾਵੇਜ਼",
    labReports: "ਲੈਬ ਰਿਪੋਰਟਾਂ",
    prescriptions: "ਨੁਸਖ਼ੇ",
    scans: "ਸਕੈਨ ਅਤੇ ਤਸਵੀਰਾਂ",
    healthRecordsTitle: "ਤੁਹਾਡੇ ਸਾਰੇ ਸਿਹਤ ਰਿਕਾਰਡ ਇੱਕੋ ਥਾਂ 'ਤੇ",
    healthRecordsDescription: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੌਰਾਨ ਅੱਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ ਇੱਥੇ ਆਪਣੇ ਆਪ ਸੁਰੱਖਿਅਤ ਹੋ ਜਾਂਦੇ ਹਨ। ਤੁਸੀਂ ਇਨ੍ਹਾਂ ਨੂੰ ਇੱਥੇ ਦੇਖ ਅਤੇ ਸੰਭਾਲ ਸਕਦੇ ਹੋ।",
    supportedFormats: "ਸਮਰਥਿਤ ਫਾਰਮੈਟ: PDF, JPG, PNG · ਵੱਧ ਤੋਂ ਵੱਧ ਆਕਾਰ: 10 MB",
    uploadFile: "ਫਾਈਲ ਅੱਪਲੋਡ ਕਰੋ",
    yourDocuments: "ਤੁਹਾਡੇ ਦਸਤਾਵੇਜ਼",
    manageDescription: "ਆਪਣੇ ਅੱਪਲੋਡ ਕੀਤੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ ਦੇਖੋ ਅਤੇ ਸੰਭਾਲੋ।",
    search: "ਦਸਤਾਵੇਜ਼ ਖੋਜੋ...",
    categories: {
      "All Documents": "ਸਾਰੇ ਦਸਤਾਵੇਜ਼",
      "Lab Reports": "ਲੈਬ ਰਿਪੋਰਟਾਂ",
      Prescriptions: "ਨੁਸਖ਼ੇ",
      "Scans & Images": "ਸਕੈਨ ਅਤੇ ਤਸਵੀਰਾਂ",
      Other: "ਹੋਰ",
    },
    loading: "ਤੁਹਾਡੇ ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...",
    noMatching: "ਕੋਈ ਮੇਲ ਖਾਂਦਾ ਦਸਤਾਵੇਜ਼ ਨਹੀਂ ਮਿਲਿਆ",
    noDocuments: "ਹਾਲੇ ਕੋਈ ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਨਹੀਂ ਕੀਤਾ ਗਿਆ",
    tryDifferent: "ਕੋਈ ਹੋਰ ਸ਼ਬਦ ਜਾਂ ਸ਼੍ਰੇਣੀ ਅਜ਼ਮਾਓ।",
    emptyDescription: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੌਰਾਨ ਅੱਪਲੋਡ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।",
    consultationUpload: "ਸਲਾਹ-ਮਸ਼ਵਰੇ ਦੌਰਾਨ ਅੱਪਲੋਡ ਕੀਤਾ",
    view: "ਵੇਖੋ",
    delete: "ਮਿਟਾਓ",
    viewTitle: "ਦਸਤਾਵੇਜ਼ ਵੇਖੋ",
    deleteTitle: "ਦਸਤਾਵੇਜ਼ ਮਿਟਾਓ",
    privacyTitle: "ਤੁਹਾਡੇ ਮੈਡੀਕਲ ਰਿਕਾਰਡ",
    privacyDescription: "ਦਸਤਾਵੇਜ਼ ਐਪਲੀਕੇਸ਼ਨ ਸਰਵਰ 'ਤੇ ਤੁਹਾਡੇ ਖਾਤੇ ਨਾਲ ਸੁਰੱਖਿਅਤ ਰੱਖੇ ਜਾਂਦੇ ਹਨ। ਇਨ੍ਹਾਂ ਨੂੰ ਵੇਖਣ ਲਈ ਲੌਗਇਨ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ।",
    uploadSubtitle: "ਆਪਣੇ ਰਿਕਾਰਡ ਵਿੱਚ ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼ ਸ਼ਾਮਲ ਕਰੋ।",
    documentCategory: "ਦਸਤਾਵੇਜ਼ ਦੀ ਸ਼੍ਰੇਣੀ",
    chooseFile: "ਫਾਈਲ ਚੁਣੋ",
    chooseDocument: "ਦਸਤਾਵੇਜ਼ ਚੁਣਨ ਲਈ ਕਲਿੱਕ ਕਰੋ",
    selected: "ਚੁਣਿਆ ਗਿਆ",
    close: "ਬੰਦ ਕਰੋ",
    upload: "ਅੱਪਲੋਡ ਕਰੋ",
    closeDialog: "ਅੱਪਲੋਡ ਵਿੰਡੋ ਬੰਦ ਕਰੋ",
    loginAgain: "ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਲੌਗਇਨ ਕਰੋ।",
    loginToView: "ਆਪਣੇ ਦਸਤਾਵੇਜ਼ ਵੇਖਣ ਲਈ ਦੁਬਾਰਾ ਲੌਗਇਨ ਕਰੋ।",
    loadError: "ਤੁਹਾਡੇ ਦਸਤਾਵੇਜ਼ ਲੋਡ ਨਹੀਂ ਹੋ ਸਕੇ।",
    uploadError: "ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਨਹੀਂ ਹੋ ਸਕਿਆ।",
    selectFirst: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਇੱਕ ਦਸਤਾਵੇਜ਼ ਚੁਣੋ।",
    deleteError: "ਦਸਤਾਵੇਜ਼ ਮਿਟਾਇਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।",
    openError: "ਦਸਤਾਵੇਜ਼ ਖੋਲ੍ਹਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।",
    popupError: "ਦਸਤਾਵੇਜ਼ ਵੇਖਣ ਲਈ ਪੌਪ-ਅੱਪ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।",
    confirmDelete: "ਕੀ ਤੁਸੀਂ ਇਸ ਦਸਤਾਵੇਜ਼ ਨੂੰ ਪੱਕੇ ਤੌਰ 'ਤੇ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    pdfError: "ਕਿਰਪਾ ਕਰਕੇ PDF, JPG ਜਾਂ PNG ਫਾਈਲ ਅੱਪਲੋਡ ਕਰੋ।",
    sizeError: "ਫਾਈਲ ਦਾ ਆਕਾਰ 10 MB ਤੋਂ ਘੱਟ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
  },
};

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

export default function MyDocuments() {
  const fileInputRef = useRef(null);

  const [language] = useState(() => {
    const storedLanguage =
      sessionStorage.getItem("medikioskLanguage") || "en";

    return storedLanguage.trim().toLowerCase();
  });

  const t = translations[language] || translations.en;

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Documents");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Lab Reports");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      localeMap[language] || "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // Fetch documents belonging to the logged-in patient.
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = sessionStorage.getItem("medikioskToken");

        if (!token) {
          throw new Error(t.loginToView);
        }

        const response = await fetch(
          `${API_URL}/api/documents/my-documents`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || t.loadError);
        }

        const formattedDocuments = (result.data || []).map((doc) => ({
          id: doc._id,
          name: doc.originalName,
          type: doc.mimeType,
          size: doc.fileSize,
          category: doc.category || "Other",
          date: formatDate(doc.createdAt),
          source: doc.uploadSource,
        }));

        setDocuments(formattedDocuments);
        setPageError("");
      } catch (err) {
        console.error("Fetch documents error:", err);
        setPageError(err.message || t.loadError);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All Documents" ||
      doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const counts = {
    total: documents.length,
    reports: documents.filter((d) => d.category === "Lab Reports").length,
    prescriptions: documents.filter(
      (d) => d.category === "Prescriptions"
    ).length,
    scans: documents.filter((d) => d.category === "Scans & Images").length,
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(t.pdfError);
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(t.sizeError);
      setSelectedFile(null);
      event.target.value = "";
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  // Upload document to backend.
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError(t.selectFirst);
      return;
    }

    try {
      setError("");

      const token = sessionStorage.getItem("medikioskToken");

      if (!token) {
        throw new Error(t.loginAgain);
      }

      const formData = new FormData();
      formData.append("medicalDocument", selectedFile);
      formData.append("category", selectedCategory);

      const response = await fetch(`${API_URL}/api/documents/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t.uploadError);
      }

      const doc = result.data;

      const newDocument = {
        id: doc._id,
        name: doc.originalName,
        type: doc.mimeType,
        size: doc.fileSize,
        category: doc.category || "Other",
        date: formatDate(doc.createdAt),
        source: "manual",
      };

      setDocuments((previous) => [newDocument, ...previous]);

      setSelectedFile(null);
      setError("");
      setShowUploadModal(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Manual upload error:", err);
      setError(err.message || t.uploadError);
    }
  };

  // Delete document from backend and update the page.
  const handleDelete = async (id) => {
    const confirmed = window.confirm(t.confirmDelete);

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setPageError("");

      const token = sessionStorage.getItem("medikioskToken");

      if (!token) {
        throw new Error(t.loginAgain);
      }

      const response = await fetch(`${API_URL}/api/documents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || t.deleteError);
      }

      setDocuments((previous) =>
        previous.filter((doc) => doc.id !== id)
      );
    } catch (err) {
      console.error("Delete document error:", err);
      setPageError(err.message || t.deleteError);
    } finally {
      setDeletingId(null);
    }
  };

  // Open a document using the authenticated file endpoint.
  const handleView = async (document) => {
    const newWindow = window.open("about:blank", "_blank");

    if (!newWindow) {
      setPageError(t.popupError);
      return;
    }

    try {
      const token = sessionStorage.getItem("medikioskToken");

      if (!token) {
        throw new Error(t.loginAgain);
      }

      const response = await fetch(
        `${API_URL}/api/documents/${document.id}/file`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || t.openError);
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);

      newWindow.location.href = fileUrl;

      setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
    } catch (err) {
      console.error("View document error:", err);
      newWindow.close();
      setPageError(err.message || t.openError);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (type) => {
    if (type === "application/pdf") return FileText;
    if (type.startsWith("image/")) return FileImage;
    return File;
  };

  const summaryCards = [
    {
      label: t.totalDocuments,
      count: counts.total,
      icon: FolderOpen,
      color: "#EAF4EE",
    },
    {
      label: t.labReports,
      count: counts.reports,
      icon: FileCheck2,
      color: "#EAF4EE",
    },
    {
      label: t.prescriptions,
      count: counts.prescriptions,
      icon: ClipboardList,
      color: "#F5EDE8",
    },
    {
      label: t.scans,
      count: counts.scans,
      icon: FileImage,
      color: "#F1F0E8",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">

        {/* Page heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#244C43] sm:text-3xl">
              {t.title}
            </h1>
            <p className="mt-2 text-sm text-[#718078] sm:text-base">
              {t.description}
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42695C]"
          >
            <Plus size={18} />
            {t.uploadDocument}
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-2xl border border-[#E9E8DF] bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#718078]">
                      {card.label}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-[#244C43]">
                      {card.count}
                    </p>
                  </div>

                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ backgroundColor: card.color }}
                  >
                    <Icon size={23} className="text-[#4F7C6D]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload information panel */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#DCEAE2] bg-[#EAF4EE] p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
              <Upload size={23} className="text-[#4F7C6D]" />
            </div>

            <div>
              <h2 className="font-semibold text-[#244C43]">
                {t.healthRecordsTitle}
              </h2>
              <p className="mt-1 text-sm leading-6 text-[#718078]">
                {t.healthRecordsDescription}
              </p>
              <p className="mt-2 text-xs text-[#718078]">
                {t.supportedFormats}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="shrink-0 rounded-xl border border-[#4F7C6D] px-4 py-2.5 text-sm font-semibold text-[#4F7C6D] transition hover:bg-white"
          >
            {t.uploadFile}
          </button>
        </div>

        {/* API error */}
        {pageError && (
          <div className="rounded-xl border border-[#F0DDD6] bg-[#F9EEEA] p-4 text-sm text-[#A45F4D]">
            {pageError}
          </div>
        )}

        {/* Document list */}
        <section className="rounded-2xl border border-[#E9E8DF] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#244C43]">
                {t.yourDocuments}
              </h2>
              <p className="mt-1 text-sm text-[#718078]">
                {t.manageDescription}
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718078]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.search}
                className="w-full rounded-xl border border-[#E9E8DF] bg-[#FFFDF8] py-2.5 pl-10 pr-4 text-sm text-[#36584E] outline-none transition focus:border-[#6FAF9B] focus:ring-2 focus:ring-[#CFEAE3]"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-[#4F7C6D] text-white"
                    : "border border-[#E9E8DF] bg-[#FFFDF8] text-[#718078] hover:bg-[#EAF4EE]"
                }`}
              >
                {t.categories[category]}
              </button>
            ))}
          </div>

          {/* Documents */}
          <div className="mt-5">
            {loading ? (
              <div className="py-14 text-center text-sm text-[#718078]">
                {t.loading}
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D9E4DC] bg-[#FFFDF8] px-5 py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF4EE]">
                  <FolderOpen size={30} className="text-[#6FAF9B]" />
                </div>

                <h3 className="mt-5 font-semibold text-[#244C43]">
                  {search ? t.noMatching : t.noDocuments}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-[#718078]">
                  {search ? t.tryDifferent : t.emptyDescription}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocuments.map((document) => {
                  const Icon = getFileIcon(document.type);

                  return (
                    <div
                      key={document.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-[#E9E8DF] bg-[#FFFDF8] p-4 transition hover:border-[#CFEAE3] sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF4EE]">
                          <Icon size={23} className="text-[#4F7C6D]" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#244C43]">
                            {document.name}
                          </h3>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#718078]">
                            <span>
                              {t.categories[document.category] ||
                                t.categories.Other}
                            </span>
                            <span>•</span>
                            <span>{formatFileSize(document.size)}</span>
                            <span>•</span>
                            <span>{document.date}</span>
                            {document.source === "consultation" && (
                              <>
                                <span>•</span>
                                <span>{t.consultationUpload}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() => handleView(document)}
                          title={t.viewTitle}
                          className="flex items-center gap-2 rounded-lg border border-[#DCEAE2] px-3 py-2 text-sm font-medium text-[#4F7C6D] transition hover:bg-[#EAF4EE]"
                        >
                          <Eye size={16} />
                          <span>{t.view}</span>
                        </button>

                        <button
                          onClick={() => handleDelete(document.id)}
                          disabled={deletingId === document.id}
                          title={t.deleteTitle}
                          className="rounded-lg border border-[#F0DDD6] p-2 text-[#B87560] transition hover:bg-[#F9EEEA] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Privacy notice */}
        <div className="flex items-start gap-3 rounded-xl border border-[#E9E8DF] bg-[#F8F7F0] p-4">
          <FileCheck2 size={20} className="mt-0.5 shrink-0 text-[#4F7C6D]" />
          <div>
            <p className="text-sm font-semibold text-[#36584E]">
              {t.privacyTitle}
            </p>
            <p className="mt-1 text-xs leading-5 text-[#718078]">
              {t.privacyDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Manual upload modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C302A]/40 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[#E9E8DF] bg-[#FFFDF8] p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#244C43]">
                  {t.uploadDocument}
                </h2>
                <p className="mt-1 text-sm text-[#718078]">
                  {t.uploadSubtitle}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-[#718078] transition hover:bg-[#EAF4EE]"
                aria-label={t.closeDialog}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  {t.documentCategory}
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E9E8DF] bg-white px-4 py-3 text-sm text-[#36584E] outline-none focus:border-[#6FAF9B]"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {t.categories[category]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#36584E]">
                  {t.chooseFile}
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border-2 border-dashed border-[#CFEAE3] bg-[#EAF4EE]/50 p-7 text-center transition hover:bg-[#EAF4EE]"
                >
                  <Upload size={27} className="mx-auto text-[#4F7C6D]" />

                  <p className="mt-3 text-sm font-semibold text-[#36584E]">
                    {selectedFile
                      ? selectedFile.name
                      : t.chooseDocument}
                  </p>

                  <p className="mt-1 text-xs text-[#718078]">
                    {t.supportedFormats}
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {selectedFile && (
                  <p className="mt-2 text-xs text-[#4F7C6D]">
                    {t.selected}: {formatFileSize(selectedFile.size)}
                  </p>
                )}

                {error && (
                  <p className="mt-2 text-sm text-[#B87560]">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-[#E9E8DF] px-5 py-2.5 text-sm font-semibold text-[#718078] transition hover:bg-[#F5F6F0]"
                >
                  {t.close}
                </button>

                <button
                  type="submit"
                  disabled={!selectedFile}
                  className={`flex items-center gap-2 rounded-xl bg-[#4F7C6D] px-5 py-2.5 text-sm font-semibold text-white transition ${
                    !selectedFile
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-[#42695C]"
                  }`}
                >
                  <Upload size={16} />
                  {t.upload}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
