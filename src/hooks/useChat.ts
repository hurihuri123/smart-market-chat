import { useEffect, useState } from "react";
import { sendChatMessage, ChatResponse } from "@/services/chatService";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UseChatOptions {
  isOnboarding?: boolean;
}

export function useChat(_: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const placeholders = [
    "ספר לי מה תרצה לשווק...",
    "תאר את המוצר או השירות שלך...",
    "מי קהל היעד שלך?...",
    "מה המטרה השיווקית שלך?...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const data: ChatResponse = await sendChatMessage(userMessage.content, conversationId);

      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message ?? "…",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (data.is_complete) {
        window.alert("הצ'אט הושלם בהצלחה.");
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "מצטער, משהו השתבש בהתקשרות לשרת.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const progress = 0;
  const conversationStep = 0;

  return {
    // state
    messages,
    input,
    isLoading,
    conversationStep,
    placeholderIndex,
    // derived
    currentPlaceholder: placeholders[placeholderIndex],
    progress,
    // setters
    setInput,
    // actions
    handleSend,
    handleKeyDown,
  };
}
