"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { initialAssistantMessage } from "@/features/chatbot/data/ChatData";
import type {
  ChatApiResponse,
  ChatMessage,
} from "@/features/chatbot/types/Chatbot";
import {
  getScreeningChatContextEventDetail,
  SCREENING_CHAT_CONTEXT_EVENT,
} from "@/features/chatbot/utils/ScreeningContext";
import type { ScreeningChatContext } from "@/features/screening/types/Screening";

const CHAT_ERROR_MESSAGE =
  "Maaf, Asisten CardioSense sedang tidak tersedia. Untuk keluhan mendesak seperti nyeri dada berat, sesak napas, atau pingsan, segera hubungi layanan darurat atau fasilitas kesehatan terdekat.";

// Membuat format pesan yang seragam sebelum disimpan di state chat.
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
  // Hook ini menjadi pusat alur chatbot: state UI, input, loading, dan request API.
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialAssistantMessage,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [screeningContext, setScreeningContext] =
    useState<ScreeningChatContext | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((value) => !value), []);

  const requestAssistantResponse = useCallback(async (nextMessages: ChatMessage[]) => {
    // History singkat dikirim ke route server agar Groq menjawab dengan konteks chat.
    abortControllerRef.current?.abort();
    setIsTyping(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Browser mengirim seluruh history chat saat ini ke API internal Next.js.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages, screeningContext }),
        signal: abortController.signal,
      });

      // API internal membalas JSON berisi message dari Groq atau error.
      const data = (await response.json()) as ChatApiResponse;
      const assistantMessage = data.message;

      if (!response.ok || !assistantMessage) {
        throw new Error(data.error ?? "Chat request failed");
      }

      // Jawaban assistant dimasukkan ke state, lalu ChatWindow merender bubble baru.
      setMessages((currentMessages) => [
        ...currentMessages,
        createChatMessage("assistant", assistantMessage),
      ]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      // Pesan error juga masuk ke state agar tampil sebagai bubble assistant.
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
  }, [screeningContext]);

  const sendMessage = useCallback(
    (message?: string) => {
      // Pesan manual dan quick prompt masuk ke alur yang sama.
      const content = (message ?? inputValue).trim();

      if (!content || isTyping) {
        return;
      }

      // Teks user dibungkus menjadi ChatMessage sebelum masuk ke UI dan API.
      const userMessage = createChatMessage("user", content);
      const nextMessages = [...messages, userMessage];

      // Pesan user tampil dulu di UI agar chat terasa responsif.
      setMessages(nextMessages);
      setInputValue("");
      setIsOpen(true);

      // Setelah UI diperbarui, history terbaru dikirim ke /api/chat.
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

  useEffect(() => {
    const handleScreeningContext = (event: Event) => {
      const detail = getScreeningChatContextEventDetail(event);

      if (!detail) {
        return;
      }

      setScreeningContext(detail.context);
      setInputValue(detail.prompt);
      setIsOpen(true);
    };

    window.addEventListener(
      SCREENING_CHAT_CONTEXT_EVENT,
      handleScreeningContext,
    );

    return () => {
      window.removeEventListener(
        SCREENING_CHAT_CONTEXT_EVENT,
        handleScreeningContext,
      );
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
