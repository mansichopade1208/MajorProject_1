
import { useState, useEffect, useRef } from "react";
import {
  Send,
  ClipboardList,
  Pencil,
  Volume2,
  Mic,
  MicOff,
} from "lucide-react";

const translations = {
  en: {
    title: "Medical history",
    example:
      "For example: I have diabetes, I am allergic to penicillin, and I currently take...",
    prompt:
      "Please provide information about your medical history or any allergies you may have.",
    submitted: "Medical history submitted",
    edit: "Edit",
    listen: "Listen again",
    speak: "Speak",
    stop: "Stop speaking",
    placeholder: "Enter your medical history, allergies, current medications, or any other relevant information...",
    send: "Send",
    speechError: "Speech recognition is not supported in this browser.",
  },

  hi: {
    title: "चिकित्सा इतिहास",
    example:
      "उदाहरण: मुझे मधुमेह है, मुझे पेनिसिलिन से एलर्जी है और मैं वर्तमान में दवाएँ ले रहा/रही हूँ...",
    prompt:
      "कृपया अपने चिकित्सा इतिहास या किसी भी प्रकार की एलर्जी के बारे में जानकारी दें।",
    submitted: "चिकित्सा इतिहास जमा किया गया",
    edit: "संपादित करें",
    listen: "दोबारा सुनें",
    speak: "बोलें",
    stop: "बोलना बंद करें",
    placeholder: "अपना चिकित्सा इतिहास, एलर्जी, वर्तमान दवाओं या अन्य संबंधित जानकारी दर्ज करें...",
    send: "भेजें",
    speechError: "इस ब्राउज़र में वाक् पहचान की सुविधा उपलब्ध नहीं है।",
  },

  gu: {
    title: "તબીબી ઇતિહાસ",
    example:
      "ઉદાહરણ: મને ડાયાબિટીસ છે, મને પેનિસિલિનથી એલર્જી છે અને હું હાલમાં દવાઓ લઉં છું...",
    prompt:
      "કૃપા કરીને તમારા તબીબી ઇતિહાસ અથવા કોઈપણ એલર્જી વિશે માહિતી આપો.",
    submitted: "તબીબી ઇતિહાસ સબમિટ થયો",
    edit: "ફેરફાર કરો",
    listen: "ફરીથી સાંભળો",
    speak: "બોલો",
    stop: "બોલવાનું બંધ કરો",
    placeholder: "તમારો તબીબી ઇતિહાસ, એલર્જી, હાલમાં લેતા દવાઓ અથવા અન્ય સંબંધિત માહિતી દાખલ કરો...",
    send: "મોકલો",
    speechError: "આ બ્રાઉઝરમાં વૉઇસ ઓળખની સુવિધા ઉપલબ્ધ નથી.",
  },

  mr: {
    title: "वैद्यकीय इतिहास",
    example:
      "उदाहरण: मला मधुमेह आहे, मला पेनिसिलिनची ॲलर्जी आहे आणि मी सध्या औषधे घेत आहे...",
    prompt:
      "कृपया तुमच्या वैद्यकीय इतिहासाबद्दल किंवा कोणत्याही ॲलर्जीबद्दल माहिती द्या.",
    submitted: "वैद्यकीय इतिहास सबमिट केला",
    edit: "संपादित करा",
    listen: "पुन्हा ऐका",
    speak: "बोला",
    stop: "बोलणे थांबवा",
    placeholder: "तुमचा वैद्यकीय इतिहास, ॲलर्जी, सध्या घेत असलेली औषधे किंवा इतर संबंधित माहिती लिहा...",
    send: "पाठवा",
    speechError: "या ब्राउझरमध्ये स्पीच रेकग्निशन उपलब्ध नाही.",
  },

  bn: {
    title: "চিকিৎসার ইতিহাস",
    example:
      "উদাহরণ: আমার ডায়াবেটিস আছে, পেনিসিলিনে অ্যালার্জি আছে এবং আমি বর্তমানে ওষুধ গ্রহণ করি...",
    prompt:
      "অনুগ্রহ করে আপনার চিকিৎসার ইতিহাস বা কোনো অ্যালার্জি সম্পর্কে তথ্য দিন।",
    submitted: "চিকিৎসার ইতিহাস জমা দেওয়া হয়েছে",
    edit: "সম্পাদনা করুন",
    listen: "আবার শুনুন",
    speak: "বলুন",
    stop: "বলা বন্ধ করুন",
    placeholder: "আপনার চিকিৎসার ইতিহাস, অ্যালার্জি, বর্তমান ওষুধ বা অন্যান্য প্রাসঙ্গিক তথ্য লিখুন...",
    send: "পাঠান",
    speechError: "এই ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়।",
  },

  ta: {
    title: "மருத்துவ வரலாறு",
    example:
      "உதாரணம்: எனக்கு நீரிழிவு நோய் உள்ளது, பெனிசிலினுக்கு ஒவ்வாமை உள்ளது, தற்போது மருந்துகள் எடுத்துக்கொள்கிறேன்...",
    prompt:
      "உங்கள் மருத்துவ வரலாறு அல்லது ஏதேனும் ஒவ்வாமைகள் பற்றிய தகவல்களை வழங்கவும்.",
    submitted: "மருத்துவ வரலாறு சமர்ப்பிக்கப்பட்டது",
    edit: "திருத்து",
    listen: "மீண்டும் கேளுங்கள்",
    speak: "பேசுங்கள்",
    stop: "பேசுவதை நிறுத்து",
    placeholder: "உங்கள் மருத்துவ வரலாறு, ஒவ்வாமைகள், தற்போது எடுத்துக்கொள்ளும் மருந்துகள் அல்லது பிற தகவல்களை உள்ளிடவும்...",
    send: "அனுப்பு",
    speechError: "இந்த உலாவியில் பேச்சு அடையாளம் காணும் வசதி ஆதரிக்கப்படவில்லை.",
  },

  te: {
    title: "వైద్య చరిత్ర",
    example:
      "ఉదాహరణ: నాకు మధుమేహం ఉంది, పెన్సిలిన్‌కు అలెర్జీ ఉంది మరియు ప్రస్తుతం మందులు వాడుతున్నాను...",
    prompt:
      "దయచేసి మీ వైద్య చరిత్ర లేదా ఏవైనా అలెర్జీల గురించి సమాచారం అందించండి.",
    submitted: "వైద్య చరిత్ర సమర్పించబడింది",
    edit: "సవరించండి",
    listen: "మళ్లీ వినండి",
    speak: "మాట్లాడండి",
    stop: "మాట్లాడటం ఆపండి",
    placeholder: "మీ వైద్య చరిత్ర, అలెర్జీలు, ప్రస్తుతం వాడుతున్న మందులు లేదా ఇతర సంబంధిత సమాచారాన్ని నమోదు చేయండి...",
    send: "పంపండి",
    speechError: "ఈ బ్రౌజర్‌లో స్పీచ్ రికగ్నిషన్ అందుబాటులో లేదు.",
  },

  kn: {
    title: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ",
    example:
      "ಉದಾಹರಣೆ: ನನಗೆ ಮಧುಮೇಹವಿದೆ, ಪೆನಿಸಿಲಿನ್‌ಗೆ ಅಲರ್ಜಿ ಇದೆ ಮತ್ತು ನಾನು ಪ್ರಸ್ತುತ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ...",
    prompt:
      "ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ಅಥವಾ ಯಾವುದೇ ಅಲರ್ಜಿಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿ ನೀಡಿ.",
    submitted: "ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ ಸಲ್ಲಿಸಲಾಗಿದೆ",
    edit: "ಸಂಪಾದಿಸಿ",
    listen: "ಮತ್ತೆ ಕೇಳಿ",
    speak: "ಮಾತನಾಡಿ",
    stop: "ಮಾತನಾಡುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
    placeholder: "ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ, ಅಲರ್ಜಿಗಳು, ಪ್ರಸ್ತುತ ಔಷಧಿಗಳು ಅಥವಾ ಇತರ ಸಂಬಂಧಿತ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ...",
    send: "ಕಳುಹಿಸಿ",
    speechError: "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸ್ಪೀಚ್ ರೆಕಗ್ನಿಷನ್ ಲಭ್ಯವಿಲ್ಲ.",
  },

  ml: {
    title: "മെഡിക്കൽ ചരിത്രം",
    example:
      "ഉദാഹരണം: എനിക്ക് പ്രമേഹമുണ്ട്, പെൻസിലിനോട് അലർജിയുണ്ട്, നിലവിൽ മരുന്നുകൾ കഴിക്കുന്നുണ്ട്...",
    prompt:
      "നിങ്ങളുടെ മെഡിക്കൽ ചരിത്രത്തെക്കുറിച്ചോ ഏതെങ്കിലും അലർജികളെക്കുറിച്ചോ വിവരങ്ങൾ നൽകുക.",
    submitted: "മെഡിക്കൽ ചരിത്രം സമർപ്പിച്ചു",
    edit: "തിരുത്തുക",
    listen: "വീണ്ടും കേൾക്കുക",
    speak: "സംസാരിക്കുക",
    stop: "സംസാരിക്കുന്നത് നിർത്തുക",
    placeholder: "നിങ്ങളുടെ മെഡിക്കൽ ചരിത്രം, അലർജികൾ, നിലവിൽ കഴിക്കുന്ന മരുന്നുകൾ അല്ലെങ്കിൽ മറ്റ് വിവരങ്ങൾ നൽകുക...",
    send: "അയയ്ക്കുക",
    speechError: "ഈ ബ്രൗസറിൽ സ്പീച്ച് റെക്കഗ്നിഷൻ ലഭ്യമല്ല.",
  },

  pa: {
    title: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ",
    example:
      "ਉਦਾਹਰਨ: ਮੈਨੂੰ ਸ਼ੂਗਰ ਹੈ, ਮੈਨੂੰ ਪੈਨਿਸਿਲਿਨ ਤੋਂ ਐਲਰਜੀ ਹੈ ਅਤੇ ਮੈਂ ਇਸ ਸਮੇਂ ਦਵਾਈਆਂ ਲੈ ਰਿਹਾ/ਰਹੀ ਹਾਂ...",
    prompt:
      "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਜਾਂ ਕਿਸੇ ਵੀ ਐਲਰਜੀ ਬਾਰੇ ਜਾਣਕਾਰੀ ਦਿਓ।",
    submitted: "ਮੈਡੀਕਲ ਇਤਿਹਾਸ ਜਮ੍ਹਾਂ ਕੀਤਾ ਗਿਆ",
    edit: "ਸੋਧੋ",
    listen: "ਦੁਬਾਰਾ ਸੁਣੋ",
    speak: "ਬੋਲੋ",
    stop: "ਬੋਲਣਾ ਬੰਦ ਕਰੋ",
    placeholder: "ਆਪਣਾ ਮੈਡੀਕਲ ਇਤਿਹਾਸ, ਐਲਰਜੀ, ਮੌਜੂਦਾ ਦਵਾਈਆਂ ਜਾਂ ਹੋਰ ਸੰਬੰਧਿਤ ਜਾਣਕਾਰੀ ਦਰਜ ਕਰੋ...",
    send: "ਭੇਜੋ",
    speechError: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਸਪੀਚ ਰਿਕਗਨੀਸ਼ਨ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
  },
};

const speechLanguages = {
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

export default function MedicalHistory({
  onComplete,
  language,
}) {
  const [history, setHistory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // Get the selected language.
  const storedLanguage =
    typeof window !== "undefined"
      ? sessionStorage.getItem("medikioskLanguage")
      : null;

  const selectedLanguage = (
    storedLanguage || language || "en"
  )
    .trim()
    .toLowerCase();

  const t = translations[selectedLanguage] || translations.en;

  const speechLanguage =
    speechLanguages[selectedLanguage] || "en-IN";

  function speakPrompt() {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(t.prompt);

    message.lang = speechLanguage;
    message.rate = 0.95;

    window.speechSynthesis.speak(message);
  }

  useEffect(() => {
    speakPrompt();

    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, [selectedLanguage]);

  function toggleListening() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(t.speechError);
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = speechLanguage;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setHistory(transcript.trim());
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();

    setListening(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const text = history.trim();

    if (!text) return;

    recognitionRef.current?.stop();

    onComplete(text);

    setHistory(text);
    setSubmitted(true);
  }

  function handleEdit() {
    setSubmitted(false);
  }

  return (
    <div className="mt-6 rounded-xl border border-[#DCE5DC] bg-[#F8FAF6] p-5">

      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
          <ClipboardList size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-[#214D43]">
            {t.title}
          </h2>

          <p className="text-sm text-gray-500">
            {t.example}
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="mt-5 rounded-xl border border-[#DCE5DC] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#214D43]">
              {t.submitted}
            </h3>

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#47796E] hover:underline"
            >
              <Pencil size={14} />
              {t.edit}
            </button>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {history}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5">

          {/* Voice controls */}
          <div className="mb-3 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={speakPrompt}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#47796E] hover:underline"
            >
              <Volume2 size={16} />
              {t.listen}
            </button>

            <button
              type="button"
              onClick={toggleListening}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#47796E] hover:underline"
            >
              {listening ? (
                <MicOff size={16} />
              ) : (
                <Mic size={16} />
              )}

              {listening ? t.stop : t.speak}
            </button>
          </div>

          {/* Medical history input */}
          <textarea
            id="medical-history"
            value={history}
            onChange={(event) =>
              setHistory(event.target.value)
            }
            rows={5}
            maxLength={5000}
            required
            placeholder={t.placeholder}
            className="w-full resize-y rounded-xl border border-[#DCE5DC] bg-white p-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#47796E] focus:ring-2 focus:ring-[#E0EEE7]"
          />

          {/* Character count */}
          <p className="mt-2 text-right text-xs text-gray-400">
            {history.length}/5000
          </p>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!history.trim()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.send}
            <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}
