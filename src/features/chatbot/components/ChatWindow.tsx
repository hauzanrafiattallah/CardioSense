"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

import { ChatBubble } from "@/features/chatbot/components/ChatBubble";
import { ChatHeader } from "@/features/chatbot/components/ChatHeader";
import { ChatInput } from "@/features/chatbot/components/ChatInput";
import { QuickPrompts } from "@/features/chatbot/components/QuickPrompts";
import type { ChatMessage } from "@/features/chatbot/types/Chatbot";

type ChatWindowProps = {
  messages: ChatMessage[];
  inputValue: string;
  isTyping: boolean;
  onClose: () => void;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onQuickPrompt: (prompt: string) => void;
};

export function ChatWindow({
  messages,
  inputValue,
  isTyping,
  onClose,
  onInputChange,
  onSendMessage,
  onQuickPrompt,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <motion.section
      role="dialog"
      aria-label="Chatbot Asisten CardioSense"
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 18, scale: 0.94 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-24 left-4 right-4 flex h-[min(560px,70dvh)] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-[#FAD7DD] bg-[#FFF8F9] shadow-[0_28px_90px_rgba(197,22,36,0.22)] sm:left-auto sm:right-6 sm:w-[380px]"
    >
      <ChatHeader onClose={onClose} />

      <div className="border-b border-[#FAD7DD]/70 bg-white/84 px-4 py-3">
        <div className="flex items-start gap-2 rounded-2xl bg-[#FFF1F3] p-3 text-xs leading-5 text-[#6B7280]">
          <Info className="mt-0.5 size-4 shrink-0 text-[#C51624]" />
          <p>Informasi dari chatbot ini bersifat edukatif dan bukan diagnosis medis.</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="grid gap-4">
          {messages.map((message, index) => (
            <div key={message.id} className="grid gap-3">
              <ChatBubble message={message} />
              {index === 0 ? (
                <QuickPrompts
                  onSelectPrompt={onQuickPrompt}
                  disabled={isTyping}
                />
              ) : null}
            </div>
          ))}

          {isTyping ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-[#6B7280]"
            >
              <span className="flex gap-1 rounded-full bg-white px-3 py-2 shadow-sm">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: dot * 0.12,
                    }}
                    className="size-1.5 rounded-full bg-[#F43F4E]"
                  />
                ))}
              </span>
              Asisten sedang mengetik...
            </motion.div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput
        value={inputValue}
        isTyping={isTyping}
        onChange={onInputChange}
        onSend={onSendMessage}
      />
    </motion.section>
  );
}
