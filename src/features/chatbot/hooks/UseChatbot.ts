"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getMockAssistantResponse,
  initialAssistantMessage,
} from "@/features/chatbot/data/ChatData";
import type { ChatMessage } from "@/features/chatbot/types/Chatbot";

function createChatMessage(
  role: ChatMessage["role"],
  content: string,
): ChatMessage {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    createdAt: new Date(),
  };
}

export function useChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialAssistantMessage,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((value) => !value), []);

  const appendMockResponse = useCallback((content: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        createChatMessage("assistant", getMockAssistantResponse(content)),
      ]);
      setIsTyping(false);
      typingTimeoutRef.current = null;
    }, 760);
  }, []);

  const sendMessage = useCallback(
    (message?: string) => {
      const content = (message ?? inputValue).trim();

      if (!content || isTyping) {
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createChatMessage("user", content),
      ]);
      setInputValue("");
      appendMockResponse(content);
      setIsOpen(true);
    },
    [appendMockResponse, inputValue, isTyping],
  );

  const sendQuickPrompt = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage],
  );

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isOpen,
    messages,
    inputValue,
    isTyping,
    openChat,
    closeChat,
    toggleChat,
    setInputValue,
    sendMessage,
    sendQuickPrompt,
  };
}
