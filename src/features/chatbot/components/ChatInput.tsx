"use client";

import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  value: string;
  isTyping: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function ChatInput({
  value,
  isTyping,
  onChange,
  onSend,
}: ChatInputProps) {
  const trimmedValue = value.trim();

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="border-t border-[#FAD7DD]/80 bg-white/90 p-3 backdrop-blur">
      <div className="flex items-center gap-2 rounded-full border border-[#FAD7DD] bg-white p-1.5 shadow-[0_10px_30px_rgba(197,22,36,0.08)] focus-within:ring-2 focus-within:ring-[#F43F4E]/25">
        <label htmlFor="cardiosense-chat-input" className="sr-only">
          Tulis pesan untuk chatbot CardioSense
        </label>
        <input
          id="cardiosense-chat-input"
          type="text"
          value={value}
          aria-label="Tanyakan tentang kesehatan jantung"
          placeholder="Tanyakan tentang kesehatan jantung..."
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#111418] outline-none placeholder:text-[#9CA3AF]"
        />
        <button
          type="button"
          aria-label="Kirim pesan"
          disabled={!trimmedValue || isTyping}
          onClick={onSend}
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#C51624] text-white transition-all hover:-translate-y-0.5 hover:bg-[#F43F4E] hover:shadow-[0_12px_28px_rgba(244,63,78,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F4E]/40 disabled:cursor-not-allowed disabled:bg-[#FAD7DD] disabled:text-[#C51624]/45 disabled:shadow-none"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
