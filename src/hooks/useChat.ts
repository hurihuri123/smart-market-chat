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
        ? "Tell me what would you like to market today"
        : "How can I help you optimize your campaigns today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStep, setConversationStep] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const placeholders = [
    "Tell me what you'd like to market...",
    "Describe your product or service...",
    "Who is your target audience?...",
    "What's your marketing goal?...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onboardingQuestions = [
    "Great! Who is your target audience? Tell me about their demographics, interests, and behaviors.",
    "Perfect! What's your main campaign objective? (e.g., brand awareness, lead generation, sales conversion)",
    "Excellent! What's your budget range for this campaign?",
    "Almost there! Now, let's connect your Meta Ads account to get started. Click the button below to authenticate.",
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
        content: "Sorry, something went wrong contacting the server.",
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
