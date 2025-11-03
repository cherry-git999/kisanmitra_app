import React, { useState, useEffect, useRef } from "react";
import { useI18n } from "../i18n";
import { Send, Mic, Bot, User } from "lucide-react";

export default function ChartBot() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: t("chatbotHello") },
  ]);
  const [input, setInput] = useState("");
  const [bottomOffset, setBottomOffset] = useState(16); // initial bottom offset
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  const BOTTOM_NAV_HEIGHT = 56; // adjust according to your bottom nav

  // Reset scroll position when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: t("chatbotThanks") },
      ]);
    }, 1000);

    setInput("");
  };

  // Auto-scroll when new messages appear
  useEffect(() => {
    if (!firstRender.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      firstRender.current = false;
    }
  }, [messages]);

  // Adjust input position for mobile keyboard + bottom nav
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      const keyboardHeight =
        window.innerHeight < document.documentElement.clientHeight ? 80 : 0;
      setBottomOffset(BOTTOM_NAV_HEIGHT + keyboardHeight + 16); // 16px padding
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial call
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-[100vh] bg-primary-50">
      {/* Header */}
      <header className="bg-primary-600 text-white py-3 px-4 flex items-center justify-center shadow-md sticky top-0 z-10">
        <h1 className="text-lg font-bold">{t("aiChatbotTitle")}</h1>
      </header>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4"
        style={{
          maxHeight: `calc(100vh - 3rem - ${bottomOffset + 48}px)`,
          // 3rem: header height, 48px: input section height
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow ${
                msg.sender === "user"
                  ? "bg-primary-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <div className="flex items-start space-x-2">
                {msg.sender === "bot" && <Bot size={18} className="mt-1" />}
                <p>{msg.text}</p>
                {msg.sender === "user" && <User size={18} className="mt-1" />}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div
        className="p-3 border-t bg-white flex items-center space-x-2 fixed left-0 w-full z-20"
        style={{ bottom: `${bottomOffset}px` }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("typeMessage")}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-0"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ maxWidth: "calc(100% - 96px)" }}
          // 96px = approx width of Mic + Send + spacing
        />
        <button
          onClick={() => alert(t("voiceComingSoon"))}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 flex-shrink-0"
        >
          <Mic size={22} className="text-primary-600" />
        </button>
        <button
          onClick={handleSend}
          className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 flex-shrink-0"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}
