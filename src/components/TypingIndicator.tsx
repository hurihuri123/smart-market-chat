import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  text?: string;
}

export const TypingIndicator = ({
  text = "חושב...",
}: TypingIndicatorProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 group transition-smooth justify-start"
      )}
    >
      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>

      <div className="max-w-[80%] px-4 py-3 rounded-2xl glass-effect border border-border transition-smooth">
        <div className="flex items-center gap-2">
          <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
            {text}
          </p>
          <span className="strategy-loading-dots" aria-hidden="true">
            <span className="strategy-loading-dot" />
            <span className="strategy-loading-dot" />
            <span className="strategy-loading-dot" />
          </span>
        </div>
      </div>
    </div>
  );
};


