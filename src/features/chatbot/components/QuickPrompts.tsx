"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { quickPrompts } from "@/features/chatbot/data/ChatData";

type QuickPromptsProps = {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
};

export function QuickPrompts({ onSelectPrompt, disabled }: QuickPromptsProps) {
  return (
    <div className="rounded-3xl border border-[#FAD7DD]/80 bg-white/76 p-3 shadow-[0_12px_34px_rgba(197,22,36,0.06)]">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#C51624]">
        <Sparkles className="size-3.5 text-[#35B8E5]" />
        Pertanyaan cepat
      </div>
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <motion.button
            key={prompt}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="cursor-pointer rounded-full border border-[#FAD7DD] bg-[#FFF1F3] px-3 py-2 text-left text-xs font-semibold leading-5 text-[#C51624] transition-colors hover:border-[#C51624] hover:bg-[#C51624] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F43F4E]/40 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
