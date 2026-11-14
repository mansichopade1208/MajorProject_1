
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

export default function ConversationalInterview({ onComplete }) {
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialComplaint, setInitialComplaint] = useState("");
  const [muted, setMuted] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenRef = useRef(null);
  const mutedRef = useRef(false);

  // Detect browser voice support
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

  // Scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // AI Text-to-Speech
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

    utterance.lang = language;
    utterance.rate = 0.94;
    utterance.pitch = 1.05;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const preferredVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() === language.toLowerCase()
      ) ||
      voices.find((voice) =>
        voice.lang
          .toLowerCase()
          .startsWith(language.split("-")[0])
      );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onerror = (event) => {
      console.error("AI speech error:", event.error);
    };

    window.speechSynthesis.speak(utterance);
  }

  // Speak welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      speakAI(
        "Hello! Welcome to Mediokiosk. Please tell me what has been bothering you. You can type your symptoms or speak using the microphone."
      );
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Automatically speak every new AI question
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
      alert(
        "Voice recognition is not supported in this browser. Please use Chrome or type your answer."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognition();

    recognition.lang = language;
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

      setAnswer(transcript);
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

  // Toggle AI voice
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
        speakAI(
          "Please tell me what has been bothering you. You can type or speak your symptoms."
        );
      }
    }
  }

  // Replay last AI question
  function replayQuestion() {
    const lastMessage = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    if (lastMessage?.content) {
      speakAI(lastMessage.content);
    } else if (!started) {
      speakAI(
        "Please tell me what has been bothering you. You can type or speak your symptoms."
      );
    }
  }

  // Submit answer to AI backend
  async function handleSend(event, selectedAnswer) {
    event?.preventDefault();

    const text = (
      selectedAnswer !== undefined ? selectedAnswer : answer
    ).trim();

    if (!text || loading) return;

    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();

    const complaint = initialComplaint || text;

    const updatedMessages = [
      ...messages,
      {
        id: Date.now(),
        role: "user",
        content: text,
      },
    ];

    setStarted(true);
    setMessages(updatedMessages);
    setAnswer("");
    setSelectedOptions([]);
    setLoading(true);

    if (!initialComplaint) {
      setInitialComplaint(text);
    }

    try {
      const result = await getNextQuestion(
        complaint,
        updatedMessages.map(({ role, content }) => ({
          role,
          content,
        }))
      );

      console.log("AI API RESPONSE:", result);

      // Support direct and wrapped responses
      const resultData = result?.data ?? result;

      if (resultData.status === "continue") {
        const nextQuestion =
          resultData.question || resultData.nextQuestion;

        if (
          typeof nextQuestion !== "string" ||
          !nextQuestion.trim()
        ) {
          console.error("Question missing:", resultData);

          throw new Error(
            "AI question is missing from the response."
          );
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
            content: nextQuestion,
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
        console.error("Unexpected AI response:", resultData);

        throw new Error(
          "Unexpected response received from the AI."
        );
      }
    } catch (error) {
      console.error("Interview error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            error.message ||
            "Sorry, I couldn't process your response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  // Handle AI-generated touch options
  function handleOptionClick(option, inputType) {
    if (loading) return;

    // Other option
    if (option === "Other") {
      setAnswer((previous) =>
        previous.startsWith("Other:") ? previous : "Other: "
      );

      if (inputType === "multi_select") {
        setSelectedOptions((previous) =>
          previous.includes("Other")
            ? previous
            : [
                ...previous.filter(
                  (item) => item !== "None of these"
                ),
                "Other",
              ]
        );
      }

      inputRef.current?.focus();
      return;
    }

    // Multi-select
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

    // Single-select and yes/no
    handleSend(null, option);
  }

  // Submit multi-select answers
  function submitSelectedOptions() {
    if (!selectedOptions.length || loading) return;

    const customAnswer = answer.trim();

    if (
      selectedOptions.includes("Other") &&
      (!customAnswer || customAnswer === "Other:")
    ) {
      inputRef.current?.focus();
      return;
    }

    const finalOptions = selectedOptions.filter(
      (option) => option !== "Other"
    );

    if (selectedOptions.includes("Other")) {
      finalOptions.push(customAnswer);
    } else if (customAnswer) {
      finalOptions.push(customAnswer);
    }

    handleSend(null, finalOptions.join(", "));
  }

  // Latest assistant message
  const lastAssistantMessage = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");

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
              Health Assistant
            </h3>

            <p className="text-xs text-gray-500">
              Voice & Touch Patient Interview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              window.speechSynthesis?.cancel();
            }}
            className="rounded-lg border border-[#DDE4DB] bg-white px-2 py-2 text-xs text-gray-600 outline-none"
            aria-label="Select interview language"
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="gu-IN">ગુજરાતી</option>
            <option value="mr-IN">मराठी</option>
          </select>

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
      </div>

      {/* Conversation */}
      <div className="min-h-[180px] max-h-[420px] overflow-y-auto px-4 py-6 sm:px-6">
        {!started && (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
              <Sparkles size={28} />
            </div>

            <h4 className="text-base font-semibold text-[#214D43]">
              Welcome to Mediokiosk
            </h4>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Please describe what has been bothering you.
              You can type your symptoms or use the microphone
              to speak. I'll ask a few relevant questions to
              understand your concern better.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-[#47796E]">
              <span className="flex items-center gap-1.5">
                <Mic size={15} />
                Speak your symptoms
              </span>

              <span className="text-gray-300">|</span>

              <span className="flex items-center gap-1.5">
                <Send size={14} />
                Type your symptoms
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {messages.map((message) => {
            const isAI = message.role === "assistant";

            const isLastAssistant =
              isAI &&
              message.id === lastAssistantMessage?.id;

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  isAI ? "justify-start" : "justify-end"
                }`}
              >
                {isAI && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
                    <Bot size={17} />
                  </div>
                )}

                <div className="max-w-[90%]">
                  {/* Message bubble */}
                  <div
                    className={`whitespace-pre-wrap text-sm leading-7 ${
                      isAI
                        ? "pt-0.5 text-gray-700"
                        : "rounded-2xl rounded-br-md bg-[#326F61] px-4 py-3 text-white"
                    }`}
                  >
                    {message.content}

                    {/* Listen again */}
                    {isAI && message.content && (
                      <button
                        type="button"
                        onClick={() => speakAI(message.content)}
                        className="mt-2 flex items-center gap-1 text-xs text-[#47796E] hover:underline"
                      >
                        <Volume2 size={14} />
                        Listen again
                      </button>
                    )}
                  </div>

                  {/* Dynamic AI-generated options */}
                  {isLastAssistant &&
                    message.options?.length > 0 && (
                      <div className="mt-4">
                        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Sparkles
                            size={14}
                            className="text-[#47796E]"
                          />

                          {message.inputType === "multi_select"
                            ? "Select all that apply"
                            : "Choose an option"}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {message.options.map((option) => {
                            const isSelected =
                              selectedOptions.includes(option);

                            return (
                              <button
                                key={option}
                                type="button"
                                disabled={loading}
                                onClick={() =>
                                  handleOptionClick(
                                    option,
                                    message.inputType
                                  )
                                }
                                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  isSelected
                                    ? "border-[#326F61] bg-[#EAF3ED] text-[#285C50]"
                                    : "border-[#DDE8DF] bg-[#FCFDFB] text-[#326F61] hover:border-[#326F61] hover:bg-[#EAF3ED]"
                                }`}
                              >
                                {message.inputType ===
                                  "multi_select" && (
                                  <span
                                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                                      isSelected
                                        ? "border-[#326F61] bg-[#326F61] text-white"
                                        : "border-[#B8C9BC]"
                                    }`}
                                  >
                                    {isSelected && (
                                      <Check size={11} />
                                    )}
                                  </span>
                                )}

                                {option}
                              </button>
                            );
                          })}
                        </div>

                        {/* Multi-select submit */}
                        {message.inputType === "multi_select" && (
                          <button
                            type="button"
                            onClick={submitSelectedOptions}
                            disabled={
                              !selectedOptions.length ||
                              loading ||
                              (selectedOptions.includes("Other") &&
                                (!answer.trim() ||
                                  answer.trim() === "Other:"))
                            }
                            className="mt-3 rounded-lg bg-[#326F61] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#285C50] disabled:cursor-not-allowed disabled:bg-[#DCE5DC] disabled:text-gray-400"
                          >
                            Submit selected answers
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
                <Bot size={17} />
              </div>

              <span className="animate-pulse">
                Thinking...
              </span>
            </div>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Voice status */}
      {listening && (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-xl bg-[#EAF3ED] px-4 py-3 text-sm text-[#326F61] sm:mx-6">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          Listening... Speak now
        </div>
      )}

      {/* Composer */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 rounded-2xl border border-[#DDE4DB] bg-[#FCFDFB] p-3 transition focus-within:border-[#9BBCAF] focus-within:shadow-sm"
        >
          {/* Microphone */}
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

          {/* Text input */}
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
                ? "Listening to your answer..."
                : !started
                  ? "Describe what has been bothering you..."
                  : "Type or speak your answer..."
            }
            rows={1}
            maxLength={2000}
            className="min-h-[40px] max-h-32 min-w-0 flex-1 resize-y bg-transparent px-1 py-2 text-sm leading-6 text-gray-700 outline-none placeholder:text-gray-400"
          />

          {/* Send */}
          <button
            type="submit"
            disabled={!answer.trim() || loading}
            aria-label="Send message"
            className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#326F61] text-white transition hover:bg-[#285C50] disabled:cursor-not-allowed disabled:bg-[#DCE5DC] disabled:text-gray-400"
          >
            <Send size={17} />
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            You can type or speak your response
          </p>

          <button
            type="button"
            onClick={replayQuestion}
            className="flex items-center gap-1 text-xs font-medium text-[#47796E] hover:underline"
          >
            <RotateCcw size={13} />
            Repeat question
          </button>
        </div>
      </div>
    </section>
  );
}
