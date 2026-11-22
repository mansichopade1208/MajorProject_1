
import {
  ClipboardList,
  FileText,
  MessageCircle,
} from "lucide-react";

const translations = {
  en: {
    patientProblem: "Patient problem",
    noSummary: "No interview summary available.",
    medicalHistory: "Medical history",
    noHistory: "No medical history provided.",
    medicalDocuments: "Medical documents",
    pdfSelected: "PDFs selected",
    pdfSelectedSingle: "PDF selected",
    noDocuments: "No documents uploaded.",
    confirmation:
      "Please check that the information above is correct before submitting.",
    pdf: "PDF",
  },
  hi: {
    patientProblem: "मरीज़ की समस्या",
    noSummary: "इंटरव्यू का कोई सारांश उपलब्ध नहीं है।",
    medicalHistory: "चिकित्सा इतिहास",
    noHistory: "कोई चिकित्सा इतिहास नहीं दिया गया है।",
    medicalDocuments: "चिकित्सा दस्तावेज़",
    pdfSelected: "PDF चुनी गई हैं",
    pdfSelectedSingle: "PDF चुनी गई है",
    noDocuments: "कोई दस्तावेज़ अपलोड नहीं किया गया है।",
    confirmation: "सबमिट करने से पहले कृपया ऊपर दी गई जानकारी की जाँच कर लें।",
    pdf: "PDF",
  },
  gu: {
    patientProblem: "દર્દીની સમસ્યા",
    noSummary: "ઇન્ટરવ્યૂનો કોઈ સારાંશ ઉપલબ્ધ નથી.",
    medicalHistory: "તબીબી ઇતિહાસ",
    noHistory: "કોઈ તબીબી ઇતિહાસ આપવામાં આવ્યો નથી.",
    medicalDocuments: "તબીબી દસ્તાવેજો",
    pdfSelected: "PDF પસંદ કરેલી છે",
    pdfSelectedSingle: "PDF પસંદ કરેલી છે",
    noDocuments: "કોઈ દસ્તાવેજ અપલોડ કરવામાં આવ્યો નથી.",
    confirmation: "સબમિટ કરતા પહેલાં કૃપા કરીને ઉપર આપેલી માહિતી તપાસો.",
    pdf: "PDF",
  },
  mr: {
    patientProblem: "रुग्णाची समस्या",
    noSummary: "मुलाखतीचा कोणताही सारांश उपलब्ध नाही.",
    medicalHistory: "वैद्यकीय इतिहास",
    noHistory: "वैद्यकीय इतिहास दिलेला नाही.",
    medicalDocuments: "वैद्यकीय कागदपत्रे",
    pdfSelected: "PDF निवडल्या आहेत",
    pdfSelectedSingle: "PDF निवडली आहे",
    noDocuments: "कोणतेही कागदपत्र अपलोड केलेले नाही.",
    confirmation: "सबमिट करण्यापूर्वी कृपया वरील माहिती तपासा.",
    pdf: "PDF",
  },
  bn: {
    patientProblem: "রোগীর সমস্যা",
    noSummary: "সাক্ষাৎকারের কোনো সারাংশ পাওয়া যায়নি।",
    medicalHistory: "চিকিৎসার ইতিহাস",
    noHistory: "কোনো চিকিৎসার ইতিহাস দেওয়া হয়নি।",
    medicalDocuments: "চিকিৎসার নথিপত্র",
    pdfSelected: "টি PDF নির্বাচিত",
    pdfSelectedSingle: "টি PDF নির্বাচিত",
    noDocuments: "কোনো নথি আপলোড করা হয়নি।",
    confirmation: "জমা দেওয়ার আগে অনুগ্রহ করে উপরের তথ্য যাচাই করুন।",
    pdf: "PDF",
  },
  ta: {
    patientProblem: "நோயாளியின் பிரச்சனை",
    noSummary: "நேர்காணல் சுருக்கம் எதுவும் இல்லை.",
    medicalHistory: "மருத்துவ வரலாறு",
    noHistory: "மருத்துவ வரலாறு வழங்கப்படவில்லை.",
    medicalDocuments: "மருத்துவ ஆவணங்கள்",
    pdfSelected: "PDF கோப்புகள் தேர்ந்தெடுக்கப்பட்டன",
    pdfSelectedSingle: "PDF கோப்பு தேர்ந்தெடுக்கப்பட்டது",
    noDocuments: "ஆவணங்கள் எதுவும் பதிவேற்றப்படவில்லை.",
    confirmation: "சமர்ப்பிக்கும் முன் மேலே உள்ள தகவல்களைச் சரிபார்க்கவும்.",
    pdf: "PDF",
  },
  te: {
    patientProblem: "రోగి సమస్య",
    noSummary: "ఇంటర్వ్యూ సారాంశం అందుబాటులో లేదు.",
    medicalHistory: "వైద్య చరిత్ర",
    noHistory: "వైద్య చరిత్ర అందించబడలేదు.",
    medicalDocuments: "వైద్య పత్రాలు",
    pdfSelected: "PDFలు ఎంచుకోబడ్డాయి",
    pdfSelectedSingle: "PDF ఎంచుకోబడింది",
    noDocuments: "పత్రాలు ఏవీ అప్‌లోడ్ చేయబడలేదు.",
    confirmation: "సమర్పించే ముందు దయచేసి పైన ఉన్న సమాచారాన్ని తనిఖీ చేయండి.",
    pdf: "PDF",
  },
  kn: {
    patientProblem: "ರೋಗಿಯ ಸಮಸ್ಯೆ",
    noSummary: "ಸಂದರ್ಶನದ ಸಾರಾಂಶ ಲಭ್ಯವಿಲ್ಲ.",
    medicalHistory: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    noHistory: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸವನ್ನು ಒದಗಿಸಲಾಗಿಲ್ಲ.",
    medicalDocuments: "ವೈದ್ಯಕೀಯ ದಾಖಲೆಗಳು",
    pdfSelected: "PDF ಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ",
    pdfSelectedSingle: "PDF ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ",
    noDocuments: "ಯಾವುದೇ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿಲ್ಲ.",
    confirmation: "ಸಲ್ಲಿಸುವ ಮೊದಲು ಮೇಲಿನ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    pdf: "PDF",
  },
  ml: {
    patientProblem: "രോഗിയുടെ പ്രശ്നം",
    noSummary: "അഭിമുഖത്തിന്റെ സംഗ്രഹം ലഭ്യമല്ല.",
    medicalHistory: "മെഡിക്കൽ ചരിത്രം",
    noHistory: "മെഡിക്കൽ ചരിത്രം നൽകിയിട്ടില്ല.",
    medicalDocuments: "മെഡിക്കൽ രേഖകൾ",
    pdfSelected: "PDF-കൾ തിരഞ്ഞെടുത്തു",
    pdfSelectedSingle: "PDF തിരഞ്ഞെടുത്തു",
    noDocuments: "രേഖകളൊന്നും അപ്‌ലോഡ് ചെയ്തിട്ടില്ല.",
    confirmation: "സമർപ്പിക്കുന്നതിന് മുമ്പ് മുകളിലെ വിവരങ്ങൾ പരിശോധിക്കുക.",
    pdf: "PDF",
  },
  pa: {
    patientProblem: "ਮਰੀਜ਼ ਦੀ ਸਮੱਸਿਆ",
    noSummary: "ਇੰਟਰਵਿਊ ਦਾ ਕੋਈ ਸੰਖੇਪ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    medicalHistory: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
    noHistory: "ਕੋਈ ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਨਹੀਂ ਦਿੱਤਾ ਗਿਆ।",
    medicalDocuments: "ਮੈਡੀਕਲ ਦਸਤਾਵੇਜ਼",
    pdfSelected: "PDF ਚੁਣੀਆਂ ਗਈਆਂ ਹਨ",
    pdfSelectedSingle: "PDF ਚੁਣੀ ਗਈ ਹੈ",
    noDocuments: "ਕੋਈ ਦਸਤਾਵੇਜ਼ ਅੱਪਲੋਡ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
    confirmation: "ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਕਿਰਪਾ ਕਰਕੇ ਉੱਪਰ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੀ ਜਾਂਚ ਕਰੋ।",
    pdf: "PDF",
  },
};

export default function ConsultationReview({
  interviewSummary,
  medicalHistory,
  medicalDocuments = [],
  onSubmit,
  language,
}) {
  const storedLanguage =
    typeof window !== "undefined"
      ? sessionStorage.getItem("medikioskLanguage")
      : null;

  const selectedLanguage = String(
    language || storedLanguage || "en"
  )
    .trim()
    .toLowerCase();

  const t = translations[selectedLanguage] || translations.en;

  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div className="mt-6 space-y-5">
      {/* Patient problem */}
      <section className="rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
            <MessageCircle size={21} />
          </div>

          <h2 className="font-semibold text-[#214D43]">
            {t.patientProblem}
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {interviewSummary || t.noSummary}
        </p>
      </section>

      {/* Medical history */}
      <section className="rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
            <ClipboardList size={21} />
          </div>

          <h2 className="font-semibold text-[#214D43]">
            {t.medicalHistory}
          </h2>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {medicalHistory || t.noHistory}
        </p>
      </section>

      {/* Uploaded documents */}
      <section className="rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
            <FileText size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-[#214D43]">
              {t.medicalDocuments}
            </h2>

            <p className="text-sm text-gray-500">
              {medicalDocuments.length}{" "}
              {medicalDocuments.length === 1
                ? t.pdfSelectedSingle
                : t.pdfSelected}
            </p>
          </div>
        </div>

        {medicalDocuments.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            {t.noDocuments}
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {medicalDocuments.map((file, index) => (
              <div
                key={`${file.name}-${file.lastModified}-${index}`}
                className="flex items-center gap-3 rounded-lg border border-[#DCE5DC] bg-white p-3"
              >
                <FileText
                  size={20}
                  className="shrink-0 text-[#47796E]"
                />

                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium text-[#214D43]">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {t.pdf} · {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-sm leading-5 text-gray-500">
        {t.confirmation}
      </p>
    </div>
  );
}
