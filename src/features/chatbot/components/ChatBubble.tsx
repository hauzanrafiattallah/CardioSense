"use client";

import { motion } from "framer-motion";
import { Bot, HeartPulse } from "lucide-react";

import type { ChatMessage } from "@/features/chatbot/types/Chatbot";
import { cn } from "@/lib/Utils";

type ChatBubbleProps = {
  message: ChatMessage;
};

function stripMarkdownMarkers(value: string) {
  return value.replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function renderInlineText(value: string) {
  return value.split(/(\*\*[^*]+\*\*)/g).map((segment, index) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={`${segment}-${index}`} className="font-bold">
          {stripMarkdownMarkers(segment)}
        </strong>
      );
    }

    return segment;
  });
}

function isTableDivider(line: string) {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(line);
}

function getTableCells(line: string) {
  if (!line.includes("|")) {
    return null;
  }

  const cells = line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(stripMarkdownMarkers)
    .filter(Boolean);

  return cells.length >= 2 ? cells : null;
}

function FormattedChatContent({ content }: { content: string }) {
  const lines = content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="space-y-2 break-words">
      {lines.map((line, index) => {
        if (isTableDivider(line)) {
          return null;
        }

        const tableCells = getTableCells(line);
        const bulletMatch = line.match(/^[-*]\s+(.+)$/);
        const numberedMatch = line.match(/^(\d+)[.)]\s+(.+)$/);

        if (tableCells) {
          const [label, ...descriptions] = tableCells;

          if (label.toLowerCase() === "aspek") {
            return null;
          }

          return (
            <div
              key={`${line}-${index}`}
              className="rounded-2xl bg-[#FFF8F9] px-3 py-2 ring-1 ring-[#FAD7DD]/70"
            >
              <p className="font-bold text-[#C51624]">{label}</p>
              <p className="mt-1 text-[#111418]">
                {renderInlineText(descriptions.join(" "))}
              </p>
            </div>
          );
        }

        if (bulletMatch) {
          return (
            <p key={`${line}-${index}`} className="flex gap-2">
              <span aria-hidden="true" className="text-[#C51624]">
                •
              </span>
              <span>{renderInlineText(bulletMatch[1])}</span>
            </p>
          );
        }

        if (numberedMatch) {
          return (
            <p key={`${line}-${index}`} className="flex gap-2">
              <span className="font-bold text-[#C51624]">
                {numberedMatch[1]}.
              </span>
              <span>{renderInlineText(numberedMatch[2])}</span>
            </p>
          );
        }

        return (
          <p key={`${line}-${index}`}>
            {renderInlineText(line.replace(/^#{1,6}\s+/, ""))}
          </p>
        );
      })}
    </div>
  );
}

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
          "min-w-0 max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm",
          isUser
            ? "rounded-br-lg bg-[#C51624] text-white shadow-[0_12px_26px_rgba(197,22,36,0.18)]"
            : "rounded-bl-lg border border-[#FAD7DD]/75 bg-white text-[#111418]",
        )}
      >
        {isUser ? message.content : <FormattedChatContent content={message.content} />}
      </div>

      {isUser ? (
        <div className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#C51624] text-white">
          <HeartPulse className="size-4" />
        </div>
      ) : null}
    </motion.div>
  );
}
