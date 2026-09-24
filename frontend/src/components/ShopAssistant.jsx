import { useState } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useAskShopAssistantMutation } from "../redux/api/aiApiSlice";
import { getAiSessionId } from "../Utils/aiSession";

const ShopAssistant = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I can help you find something that fits your style and budget.",
    },
  ]);
  const [askAssistant, { isLoading }] = useAskShopAssistantMutation();

  const submitHandler = async (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || isLoading) return;

    setMessage("");
    setMessages((current) => [...current, { role: "user", text }]);

    try {
      const response = await askAssistant({
        message: text,
        sessionId: getAiSessionId(),
      }).unwrap();
      setMessages((current) => [
        ...current,
        { role: "assistant", text: response.reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: error?.data?.message || "I am having trouble connecting right now.",
        },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <section className="mb-3 flex h-[min(520px,calc(100vh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#17171a] shadow-2xl">
          <header className="flex items-center justify-between border-b border-white/10 bg-pink-600 px-4 py-3">
            <div>
              <p className="font-semibold text-white">ShopExpress Assistant</p>
              <p className="text-xs text-white/70">Powered by Groq</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white/80 hover:bg-white/15 hover:text-white"
              aria-label="Close assistant"
            >
              <FaTimes />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                  item.role === "user"
                    ? "ml-auto bg-pink-600 text-white"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {item.text}
              </div>
            ))}
            {isLoading && (
              <div className="text-sm text-white/50">Thinking...</div>
            )}
          </div>

          <form onSubmit={submitHandler} className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about products..."
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-pink-400"
              maxLength={800}
            />
            <button
              type="submit"
              className="rounded-xl bg-pink-600 px-3 text-white hover:bg-pink-500 disabled:opacity-50"
              disabled={!message.trim() || isLoading}
              aria-label="Send message"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </section>
      )}

      <button
        onClick={() => setOpen((current) => !current)}
        className="ml-auto flex items-center gap-2 rounded-full bg-pink-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-950/30 transition hover:-translate-y-0.5 hover:bg-pink-500"
        aria-label="Open ShopExpress Assistant"
      >
        <FaRobot />
        <span>Ask Shop AI</span>
      </button>
    </div>
  );
};

export default ShopAssistant;
