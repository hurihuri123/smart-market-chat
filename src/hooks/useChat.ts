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

export function useChat({ isOnboarding = true }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: isOnboarding
        ? "אז מה אנחנו משווקים?\n\nאני אאסוף קצת מידע, אחר כך אציע לך אסטרטגיית פרסום ולבסוף גם אריץ את הקמפיינים עבורך 🚀"
        : "איך אוכל לעזור לך לייעל את הקמפיינים שלך היום?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
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

  const onboardingQuestions = [
    "מעולה! מי קהל היעד שלך? ספר לי על הדמוגרפיה, תחומי העניין וההתנהגויות שלהם.",
    "מושלם! מה מטרת הקמפיין העיקרית שלך? (למשל: מודעות למותג, יצירת לידים, המרות מכירות)",
    "נהדר! מה טווח התקציב שלך לקמפיין הזה?",
    "כמעט שם! עכשיו, בוא נחבר את חשבון Meta Ads שלך כדי להתחיל. לחץ על הכפתור למטה כדי להתחבר.",
  ];

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

    if (isOnboarding) {
      setConversationStep((prev) => Math.min(prev + 1, onboardingQuestions.length));
    }

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

      // Remain in chat on completion
      if (data.is_complete) {
        // no-op
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

  const progress = isOnboarding
    ? ((conversationStep + 1) / (onboardingQuestions.length + 1)) * 100
    : 0;

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
