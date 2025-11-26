import { useEffect, useState } from "react";
import { sendChatMessage, ChatResponse } from "@/services/chatService";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface AdData {
  media?: MediaItem[];
  headline: string;
  primaryText: string;
  buttonText: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  showFacebookLogin?: boolean;
  adPreview?: AdData;
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
  const [isComplete, setIsComplete] = useState(false);

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

  // Load last conversation from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("campainly_last_conversation");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.conversationId) setConversationId(parsed.conversationId);
        if (Array.isArray(parsed?.messages)) setMessages(parsed.messages);
        if (parsed?.isComplete) setIsComplete(Boolean(parsed.isComplete));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist conversation to localStorage when it changes
  useEffect(() => {
    try {
      const payload = { conversationId, messages, isComplete };
      if (conversationId || messages.length) {
        localStorage.setItem("campainly_last_conversation", JSON.stringify(payload));
      } else {
        localStorage.removeItem("campainly_last_conversation");
      }
    } catch (e) {
      // ignore
    }
  }, [conversationId, messages, isComplete]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsComplete(false);

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
        showFacebookLogin: data.is_complete || false,
      };
      setMessages((prev) => [...prev, assistantMessage]);
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

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
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
    isComplete,
    conversationId,
    // derived
    currentPlaceholder: placeholders[placeholderIndex],
    progress,
    // setters
    setInput,
    setIsComplete,
    setConversationId,
    // actions
    handleSend,
    handleKeyDown,
    addMessage,
  };
}
