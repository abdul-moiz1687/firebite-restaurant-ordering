
"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Flame,
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw,
} from "lucide-react";

const welcomeMessage = {
  role: "model",
  text: "Hey! Welcome to Firebite! 🔥\n\nI'm your personal food assistant. Looking for something spicy, cheesy or delicious within your budget? Let's find your perfect meal!",
};

const quickPrompts = [
  "Suggest something under Rs. 1,000",
  "What are your bestsellers?",
  "I want something spicy 🌶️",
];

function FormattedMessage({ text }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        const bullet = line.match(/^\*\s+(.*)$/);
        const content = bullet ? bullet[1] : line;

        const parts = content.split(/(\*\*.*?\*\*)/g);

        const formatted = parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            part
          )
        );

        if (!line) {
          return <div key={index} className="h-2" />;
        }

        if (bullet) {
          return (
            <div key={index} className="flex gap-2">
              <span className="text-[#df4428]">•</span>
              <span>{formatted}</span>
            </div>
          );
        }

        return <p key={index}>{formatted}</p>;
      })}
    </div>
  );
}

export default function FirebiteChat() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading, isOpen]);

  // Never display the chatbot inside the admin area.
  if (pathname?.startsWith("/admin")) {
    return null;
  }

async function sendMessage(value) {
  const text = value.trim();

  if (!text || isLoading) return;

  // Welcome message UI mein rahega, API history mein nahi jayega.
  const conversationHistory = messages.slice(1);

  const apiMessages = [
    ...conversationHistory,
    { role: "user", text },
  ].slice(-10);

  setMessages([welcomeMessage, ...apiMessages]);
  setInput("");
  setIsLoading(true);

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: apiMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    if (typeof data.reply !== "string" || !data.reply.trim()) {
      throw new Error("The AI returned an empty response.");
    }

    setMessages((current) => [
      ...current,
      { role: "model", text: data.reply },
    ]);
  } catch (error) {
    setMessages((current) => [
      ...current,
      {
        role: "model",
        text: error.message || "Unable to connect. Please try again.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
}

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  function resetChat() {
    if (isLoading) return;
    setMessages([welcomeMessage]);
    setInput("");
  }

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Firebite AI assistant"
          className="fixed bottom-5 right-5 z-[80] flex h-16 w-16 items-center justify-center rounded-full bg-[#df4428] text-white shadow-xl shadow-[#df4428]/30 transition duration-200 hover:-translate-y-1 hover:bg-[#bd321b] active:scale-95"
        >
          <MessageCircle size={28} />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#fffdf9] bg-green-500 text-[10px]">
            ●
          </span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <section
          aria-label="Firebite AI chat"
          className="fixed bottom-4 right-3 z-[80] flex h-[min(620px,calc(100dvh-6rem))] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-[#e9e0d7] bg-[#fffdf9] shadow-2xl sm:bottom-5 sm:right-5"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-[#df4428] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <Flame size={25} />
              </div>

              <div>
                <h2 className="font-black tracking-tight">
                  FIREBITE AI
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-white/85">
                  <span className="h-2 w-2 rounded-full bg-green-300" />
                  Your personal food assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                disabled={isLoading}
                aria-label="Reset conversation"
                className="rounded-lg p-2 transition hover:bg-white/15 disabled:opacity-50"
              >
                <RotateCcw size={17} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-2 transition hover:bg-white/15"
              >
                <X size={21} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto bg-[#fffdf9] p-4"
          >
            {messages.map((message, index) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={`${index}-${message.role}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#df4428] text-white">
                      <Flame size={17} />
                    </div>
                  )}

                  <div
                    className={`max-w-[84%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                      isUser
                        ? "rounded-br-sm bg-[#df4428] text-white"
                        : "rounded-bl-sm border border-[#e9e0d7] bg-white text-[#211b17]"
                    }`}
                  >
                    <FormattedMessage text={message.text} />
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#df4428] text-white">
                  <Sparkles size={16} />
                </div>

                <div className="rounded-xl border border-[#e9e0d7] bg-white px-4 py-3 text-sm text-[#756a61]">
                  Thinking<span className="animate-pulse">...</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="flex shrink-0 flex-wrap gap-2 border-t border-[#e9e0d7] bg-white px-3 py-3">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="rounded-full border border-[#df4428]/30 bg-[#fff0e9] px-3 py-2 text-xs font-semibold text-[#bd321b] transition hover:bg-[#df4428] hover:text-white disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 items-center gap-2 border-t border-[#e9e0d7] bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1000}
              placeholder="Ask about our delicious menu..."
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-xl border border-[#e9e0d7] bg-[#fffdf9] px-3.5 py-3 text-sm text-[#211b17] outline-none placeholder:text-[#9b8f85] focus:border-[#df4428]"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#df4428] text-white transition hover:bg-[#bd321b] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>

          <p className="shrink-0 bg-white pb-2 text-center text-[10px] text-[#9b8f85]">
            AI-generated responses · Menu prices may change
          </p>
        </section>
      )}
    </>
  );
}
