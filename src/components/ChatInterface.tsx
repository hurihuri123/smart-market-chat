import { useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { Progress } from "@/components/ui/progress";
import { useChat } from "@/hooks/useChat";

interface ChatInterfaceProps {
  isOnboarding?: boolean;
  onComplete?: () => void;
}

export const ChatInterface = ({ isOnboarding = true, onComplete }: ChatInterfaceProps) => {
  const { messages, input, setInput, isLoading, conversationStep, handleSend, handleKeyDown, currentPlaceholder, progress } = useChat({ isOnboarding });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onboardingTotalSteps = 5; // UI label only

  return (
    <div className="flex flex-col w-full min-h-[220px] max-h-[70vh] overflow-hidden rounded-[28px] border border-white/10 bg-background/70 backdrop-blur-xl shadow-[0_32px_96px_-32px_rgba(56,189,248,0.6)]">
      {/* Progress Bar */}
      {isOnboarding && conversationStep > 0 && (
        <div className="px-4 pt-3 pb-2">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1 text-center">
            שלב {conversationStep + 1} מתוך {onboardingTotalSteps}
          </p>
        </div>
      )}
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[140px]">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">חושב...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 sm:p-5 border-t border-white/10 bg-background/60">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
            className="min-h-[60px] resize-none rounded-2xl bg-secondary/60 border-white/10 focus:border-primary transition-smooth focus-visible:ring-0 focus-visible:outline-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="gradient-primary shadow-glow transition-smooth hover:shadow-[0_12px_30px_rgba(56,189,248,0.45)] hover:translate-y-[-1px]"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
