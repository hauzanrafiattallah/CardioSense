"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, HeartPulse, Sparkles } from "lucide-react";

import { ChatWindow } from "@/features/chatbot/components/ChatWindow";
import { useChatbot } from "@/features/chatbot/hooks/UseChatbot";

export function Chatbot() {
  const {
    isOpen,
    messages,
    inputValue,
    isTyping,
    closeChat,
    toggleChat,
    setInputValue,
    sendMessage,
    sendQuickPrompt,
  } = useChatbot();

  return (
    <div className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen ? (
          <ChatWindow
            messages={messages}
            inputValue={inputValue}
            isTyping={isTyping}
            onClose={closeChat}
            onInputChange={setInputValue}
            onSendMessage={() => sendMessage()}
            onQuickPrompt={sendQuickPrompt}
          />
        ) : null}
      </AnimatePresence>

      <div className="flex items-center justify-end gap-3">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="hidden rounded-full border border-[#FAD7DD] bg-white/92 px-4 py-2 text-sm font-bold text-[#C51624] shadow-[0_14px_34px_rgba(197,22,36,0.12)] backdrop-blur sm:inline-flex"
          >
            Tanya CardioSense
          </motion.div>
        ) : null}

        <motion.button
          type="button"
          aria-label="Buka chatbot CardioSense"
          onClick={toggleChat}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex size-16 cursor-pointer items-center justify-center rounded-full bg-[#C51624] text-white shadow-[0_20px_48px_rgba(197,22,36,0.34)] transition-colors hover:bg-[#F43F4E] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F43F4E]/28"
        >
          <motion.span
            aria-hidden="true"
            animate={{ scale: [1, 1.42, 1], opacity: [0.38, 0, 0.38] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-[#F43F4E]"
          />
          <span className="absolute -right-0.5 -top-0.5 flex size-6 items-center justify-center rounded-full bg-[#35B8E5] text-white ring-4 ring-white">
            <Sparkles className="size-3.5" />
          </span>
          <span className="relative flex size-12 items-center justify-center rounded-full bg-white/12">
            {isOpen ? <Bot className="size-7" /> : <HeartPulse className="size-7" />}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
