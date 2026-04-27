import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, BookOpen, Calendar, MapPin, FileText } from "lucide-react";

const quickQuestions = [
  { icon: Calendar, text: "Exam schedule?" },
  { icon: BookOpen, text: "Library hours?" },
  { icon: MapPin, text: "Admin block location?" },
  { icon: FileText, text: "Fee submission?" },
];

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  time: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    text: "👋 Hi there! I'm your Campus Assistant powered by AI. I can help you with university policies, campus navigation, event info, and more. What would you like to know?",
    time: "Now",
  },
];

const faqMap: Record<string, string> = {
  "exam": "📅 **Mid-term exams** are scheduled from **April 14–18, 2026**. Final exams run from **June 9–20, 2026**. Check your timetable on Zabdesk for exact slots.",
  "library": "📚 The **SZABIST Library** is open **Mon–Fri: 8:30 AM – 8:00 PM** and **Saturday: 9:00 AM – 2:00 PM**. It's closed on Sundays and public holidays.",
  "fee": "💳 **Fee submission** can be done via bank challan or online payment through Zabdesk. Semester 4 fee deadline is **April 30, 2026**. Late fee applies after this date.",
  "admin": "🏢 The **Administration Block** is located on the 2nd floor of the Main Building, next to the Registrar's Office. Office hours: Mon–Fri, 9:00 AM – 5:00 PM.",
  "fyp": "🎓 FYP submissions for Spring 2026 are due by **April 25, 2026**. Final presentations are scheduled from **May 5–8, 2026**. Contact your supervisor for detailed guidelines.",
  "wifi": "📶 Campus WiFi: Connect to **SZABIST-Student** network using your student ID as username and your Zabdesk password. For issues, contact IT Support at ext. 201.",
  "attendance": "📋 Minimum attendance requirement is **75%** per subject. Below this threshold may result in debarment from exams. Check your attendance on Zabdesk.",
  "default": "🤔 I found some relevant information for your query. For more detailed or specific answers, please visit the **Admin Office (2nd Floor)** or call ext. **101–105**. You can also check the Student Handbook on Zabdesk.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("exam") || lower.includes("mid") || lower.includes("final")) return faqMap.exam;
  if (lower.includes("library") || lower.includes("book") || lower.includes("hour")) return faqMap.library;
  if (lower.includes("fee") || lower.includes("payment") || lower.includes("challan")) return faqMap.fee;
  if (lower.includes("admin") || lower.includes("location") || lower.includes("block") || lower.includes("office")) return faqMap.admin;
  if (lower.includes("fyp") || lower.includes("final year") || lower.includes("project")) return faqMap.fyp;
  if (lower.includes("wifi") || lower.includes("internet") || lower.includes("network")) return faqMap.wifi;
  if (lower.includes("attendance") || lower.includes("absent")) return faqMap.attendance;
  return faqMap.default;
}

export function Assistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    await new Promise(r => setTimeout(r, 1200));
    const response = getResponse(text);
    setTyping(false);
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: "assistant",
      text: response,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
      {/* Header */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B2B] to-orange-600 rounded-2xl flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-gray-800 font-semibold">Campus Assistant</h3>
              <Sparkles size={13} className="text-[#FF6B2B]" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
              <p className="text-xs text-gray-400">AI-powered • Always online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 bg-[#FF6B2B] rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={13} className="text-white" />
              </div>
            )}
            <div className={`max-w-[80%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#FF6B2B] text-white rounded-br-sm"
                  : "bg-white text-gray-700 rounded-bl-sm shadow-sm"
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start gap-2">
            <div className="w-7 h-7 bg-[#FF6B2B] rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot size={13} className="text-white" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.text}
                onClick={() => sendMessage(q.text)}
                className="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 hover:border-[#FF6B2B] hover:text-[#FF6B2B] transition-colors"
              >
                <Icon size={12} />
                {q.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Input */}
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about policies, locations, deadlines..."
            className="flex-1 outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="w-10 h-10 bg-[#FF6B2B] rounded-2xl flex items-center justify-center shadow-md disabled:opacity-50"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
