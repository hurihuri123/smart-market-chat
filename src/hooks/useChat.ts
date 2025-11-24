import { useEffect, useState } from "react";
import { sendChatMessage, ChatResponse } from "@/services/chatService";

interface AdData {
  media?: string;
  mediaType?: "image" | "video";
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

      if (data.is_complete) {
        setIsComplete(true);
        // Add Facebook login message
        const fbMessage: Message = {
          id: Date.now().toString() + "-fb",
          role: "assistant",
          content: "מעולה! סיימנו את השלבים הראשונים. כעת, בוא נתחבר לפייסבוק כדי שאוכל להריץ את הקמפיינים עבורך 🚀",
          showFacebookLogin: true,
        };
        setMessages((prev) => [...prev, fbMessage]);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message ?? "…",
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
    // derived
    currentPlaceholder: placeholders[placeholderIndex],
    progress,
    // setters
    setInput,
    setIsComplete,
    // actions
    handleSend,
    handleKeyDown,
    addMessage,
  };
}
