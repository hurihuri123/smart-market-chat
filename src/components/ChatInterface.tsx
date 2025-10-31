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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onboardingTotalSteps = 5; // UI label only

  return (
    <div className="flex flex-col h-full">
      {/* Progress Bar */}
      {isOnboarding && conversationStep > 0 && (
        <div className="px-4 pt-3 pb-2">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Step {conversationStep + 1} of {onboardingTotalSteps}
          </p>
        </div>
      )}
      
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
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
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
      </div>
    </div>
  );
};
