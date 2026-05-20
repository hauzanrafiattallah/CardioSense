"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { initialAssistantMessage } from "@/features/chatbot/data/ChatData";
import type {
  ChatApiResponse,
  ChatMessage,
} from "@/features/chatbot/types/Chatbot";

const CHAT_ERROR_MESSAGE =
  "Maaf, Asisten CardioSense sedang tidak tersedia. Untuk keluhan mendesak seperti nyeri dada berat, sesak napas, atau pingsan, segera hubungi layanan darurat atau fasilitas kesehatan terdekat.";

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
  const abortControllerRef = useRef<AbortController | null>(null);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((value) => !value), []);

  const requestAssistantResponse = useCallback(async (nextMessages: ChatMessage[]) => {
    abortControllerRef.current?.abort();
    setIsTyping(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
        signal: abortController.signal,
      });

      const data = (await response.json()) as ChatApiResponse;
      const assistantMessage = data.message;

      if (!response.ok || !assistantMessage) {
        throw new Error(data.error ?? "Chat request failed");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createChatMessage("assistant", assistantMessage),
      ]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createChatMessage("assistant", CHAT_ERROR_MESSAGE),
      ]);
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
        setIsTyping(false);
      }
    }
  }, []);

  const sendMessage = useCallback(
    (message?: string) => {
      const content = (message ?? inputValue).trim();

      if (!content || isTyping) {
        return;
      }

      const userMessage = createChatMessage("user", content);
      const nextMessages = [...messages, userMessage];

      setMessages(nextMessages);
      setInputValue("");
      setIsOpen(true);
      void requestAssistantResponse(nextMessages);
    },
    [inputValue, isTyping, messages, requestAssistantResponse],
  );

  const sendQuickPrompt = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage],
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
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
