export type ChatRole = "assistant" | "user";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
};

export type ChatApiResponse = {
  message?: string;
  error?: string;
};
