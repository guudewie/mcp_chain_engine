"use client";

import { useState, useRef, useEffect } from "react";
import { askGemini } from "../server/actions";

export default function DashboardPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);

    const result = await askGemini(userMessage);

    if ("text" in result && result.text) {
      setMessages((prev) => [...prev, { role: "ai", content: result.text! }]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error: " + (result.error || "Unknown error") },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center">
      {/* Header */}
      <nav className="w-full max-w-5xl px-6 py-4 flex justify-between items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="font-semibold tracking-tight">Agentic Dash</span>
        </div>
        <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">
          Gemini 2.0 Flash
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-3xl flex-1 flex flex-col p-6 pb-32">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pt-20">
            <h2 className="text-4xl font-bold tracking-tight text-slate-800">
              What are we building today?
            </h2>
            <p className="text-slate-500 max-w-md">
              Connect your database and Ill help you generate schemas, run
              queries, and build MUI charts instantly.
            </p>
          </div>
        )}

        <div className="space-y-8">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`group relative max-w-[85%] px-5 py-3 rounded-2xl shadow-sm transition-all ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                }`}
              >
                <span className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Centered Floating Input Box */}
      <div className="fixed bottom-8 w-full max-w-2xl px-4">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
        >
          <input
            className="flex-1 bg-transparent border-none outline-none p-3 text-slate-900 placeholder:text-slate-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., Fetch the current sales schema..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-slate-900 text-white h-10 w-10 flex items-center justify-center rounded-xl hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 stroke-[2.5]"
            >
              <path
                d="M7 11L12 6L17 11M12 18V7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
        <p className="text-[10px] text-center mt-3 text-slate-400 uppercase tracking-widest font-medium">
          Powered by Gemini Agentic Logic
        </p>
      </div>
    </div>
  );
}
