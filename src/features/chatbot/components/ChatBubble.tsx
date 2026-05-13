"use client";

import { motion } from "framer-motion";
import { Bot, HeartPulse } from "lucide-react";

import type { ChatMessage } from "@/features/chatbot/types/Chatbot";
import { cn } from "@/lib/Utils";

type ChatBubbleProps = {
  message: ChatMessage;
};

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser ? (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#FFF1F3] text-[#C51624] ring-1 ring-[#FAD7DD]">
          <Bot className="size-4" />
        </div>
      ) : null}

      <div
        className={cn(
          "max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm",
          isUser
            ? "rounded-br-lg bg-[#C51624] text-white shadow-[0_12px_26px_rgba(197,22,36,0.18)]"
            : "rounded-bl-lg border border-[#FAD7DD]/75 bg-white text-[#111418]",
        )}
      >
        {message.content}
      </div>

      {isUser ? (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#C51624] text-white">
          <HeartPulse className="size-4" />
        </div>
      ) : null}
    </motion.div>
  );
}
