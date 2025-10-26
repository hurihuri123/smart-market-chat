import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  isOnboarding?: boolean;
  onComplete?: () => void;
}

export const ChatInterface = ({ isOnboarding = true, onComplete }: ChatInterfaceProps) => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate AI processing
    setTimeout(() => {
      if (isOnboarding) {
        const nextStep = conversationStep + 1;

        if (nextStep < onboardingQuestions.length) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: onboardingQuestions[nextStep],
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setConversationStep(nextStep);
        } else {
          // Final step - show "thinking" message then redirect
          const thinkingMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "🎯 Analyzing your campaign data...\n✨ Building your strategy...\n🚀 Setting up your Meta Ads campaign...\n\nRedirecting to your dashboard...",
          };
          setMessages((prev) => [...prev, thinkingMessage]);

          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        }
      } else {
        // Dashboard chat - generic helpful response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm analyzing your request. This feature will be connected to AI soon to provide intelligent campaign optimizations!",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        {conversationStep === onboardingQuestions.length - 1 && isOnboarding ? (
          <Button
            onClick={handleSend}
            className="w-full gradient-accent text-accent-foreground font-semibold shadow-accent-glow transition-smooth hover:scale-105"
          >
            Connect Meta Ads Account
          </Button>
        ) : (
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none bg-secondary border-border focus:border-primary transition-smooth"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="gradient-primary shadow-glow transition-smooth hover:scale-105"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
