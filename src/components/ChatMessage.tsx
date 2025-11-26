import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdPreview } from "@/components/AdPreview";

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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  showFacebookLogin?: boolean;
  adPreview?: AdData;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 group transition-smooth",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-glow flex-shrink-0">
          <Bot className="w-4 h-4" />
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[80%] px-4 py-3 rounded-2xl transition-smooth",
          isAssistant
            ? "glass-effect border border-border"
            : "gradient-primary shadow-glow"
        )}
      >
        <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        {message.adPreview && (
          <div className="mt-4">
            <AdPreview
              adData={message.adPreview}
              editable={true}
              showSubmitButton={true}
              mediaOnly={
                !message.adPreview.headline &&
                !message.adPreview.primaryText &&
                !message.adPreview.buttonText
              }
            />
          </div>
        )}
        {message.showFacebookLogin && (
          <Button
            onClick={() => {}}
            className="mt-4 w-full gradient-primary shadow-glow transition-smooth hover:shadow-[0_12px_30px_rgba(56,189,248,0.45)] hover:translate-y-[-1px]"
          >
            Login with facebook
          </Button>
        )}
      </div>

      {!isAssistant && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
