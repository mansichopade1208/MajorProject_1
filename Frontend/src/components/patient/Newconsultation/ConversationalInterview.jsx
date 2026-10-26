import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { getNextQuestion } from "../../../../services/healthInterviewService"


export default function ConversationalInterview({ onComplete }) {
  const [answer, setAnswer] = useState("");
  const [messages, setMessages] = useState([]);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialComplaint, setInitialComplaint] = useState("");
  const [interviewSummary, setInterviewSummary] = useState("");

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


async function handleSend(event) {
  event.preventDefault();

  const text = answer.trim();
  if (!text || loading) return;

  const complaint = initialComplaint || text;

  const updatedMessages = [
    ...messages,
    { id: Date.now(), role: "user", content: text },
  ];

  setStarted(true);
  setMessages(updatedMessages);
  setAnswer("");
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

    if (result.status === "continue") {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: result.nextQuestion,
        },
      ]);
    } else if (
      result.status === "completed" &&
      typeof result.summary === "string"
    ) {
      // Summary parent component ko pass hogi.
      // Summary chat mein display nahi hogi.
      onComplete?.(result.summary);
    }
  } catch (error) {
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


  return (
    <section>
      {/* Interview header */}
      <div className="flex items-center justify-between border-b border-[#EDF0EA] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E0EEE7] text-[#47796E]">
            <Bot size={22} strokeWidth={1.8} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#214D43]">
              Health Assistant
            </h3>
          
          </div>
        </div>
      </div>

      {/* Conversation area */}
      <div className="min-h-[150px] max-h-[200px] overflow-y-auto px-4 py-6 sm:px-6">
        {!started && (
          <div className="flex min-h-[100px] flex-col items-center justify-center text-center">

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Tell me what has been bothering you. I'll ask a few
              questions to better understand your symptoms and
              help prepare your health history.
            </p>

         
          </div>
        )}

        <div className="space-y-6">
          {messages.map((message) => {
            const isAI = message.role === "assistant";

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

                <div
                  className={`max-w-[85%] whitespace-pre-wrap text-sm leading-7 ${
                    isAI
                      ? "pt-0.5 text-gray-700"
                      : "rounded-2xl rounded-br-md bg-[#326F61] px-4 py-3 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            );
          })}

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

      {/* ChatGPT-style composer */}
      <div className="px-4 pb-4 sm:px-6 sm:pb-5">
        
<form
  onSubmit={handleSend}
  className="flex items-end gap-2 rounded-2xl border border-[#DDE4DB] bg-[#FCFDFB] p-3 transition focus-within:border-[#9BBCAF] focus-within:shadow-sm"
>
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
    placeholder="Describe your symptoms..."
    rows={1}
    maxLength={2000}
    className="min-h-[40px] max-h-32 min-w-0 flex-1 resize-y bg-transparent px-1 py-2 text-sm leading-6 text-gray-700 outline-none placeholder:text-gray-400"
  />

  <button
    type="submit"
    disabled={!answer.trim() || loading}
    aria-label="Send message"
    className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#326F61] text-white transition hover:bg-[#285C50] disabled:cursor-not-allowed disabled:bg-[#DCE5DC] disabled:text-gray-400"
  >
    <Send size={17} />
  </button>
</form>


   
      </div>
    </section>
  );
}
