import { useState, useEffect, useRef } from "react";
import {
  Send,
  ClipboardList,
  Pencil,
  Volume2,
  Mic,
  MicOff,
} from "lucide-react";

export default function MedicalHistory({ onComplete }) {
  const [history, setHistory] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  const prompt =
    "Please provide information about your medical history or any allergies you may have.";

  function speakPrompt() {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(prompt);
    message.lang = "en-IN";
    message.rate = 0.95;

    window.speechSynthesis.speak(message);
  }

  useEffect(() => {
    speakPrompt();

    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  function toggleListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
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
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E0EEE7] text-[#47796E]">
          <ClipboardList size={21} />
        </div>

        <div>
          <h2 className="font-semibold text-[#214D43]">
            Medical history
          </h2>
          <p className="text-sm text-gray-500">
            For example: I have diabetes, I am allergic to penicillin, and I currently take...
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="mt-5 rounded-xl border border-[#DCE5DC] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-[#214D43]">
              Medical history submitted
            </h3>

            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#47796E] hover:underline"
            >
              <Pencil size={14} />
              Edit
            </button>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
            {history}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mb-3 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={speakPrompt}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#47796E] hover:underline"
            >
              <Volume2 size={16} />
              Listen again
            </button>

            <button
              type="button"
              onClick={toggleListening}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#47796E] hover:underline"
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
              {listening ? "Stop speaking" : "Speak"}
            </button>
          </div>

          <textarea
            id="medical-history"
            value={history}
            onChange={(event) => setHistory(event.target.value)}
            rows={5}
            maxLength={5000}
            required
            className="w-full resize-y rounded-xl border border-[#DCE5DC] bg-white p-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#47796E] focus:ring-2 focus:ring-[#E0EEE7]"
          />

          <p className="mt-2 text-right text-xs text-gray-400">
            {history.length}/5000
          </p>

          <button
            type="submit"
            disabled={!history.trim()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#326F61] px-5 py-3 text-sm font-semibold text-white hover:bg-[#285C50] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send <Send size={16} />
          </button>
        </form>
      )}
    </div>
  );
}