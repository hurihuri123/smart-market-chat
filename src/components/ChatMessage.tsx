import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

const extractFirstUrl = (text: string): string | null => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  if (!urls || urls.length === 0) return null;
  return urls[0];
};

const removeUrlFromText = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '').trim();
};

const isDirectVideoFile = (url: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";
  const rawUrl = isAssistant ? extractFirstUrl(message.content) : null;
  const textContent = rawUrl ? removeUrlFromText(message.content) : message.content;

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
          "max-w-[80%] transition-smooth space-y-3",
          isAssistant ? "" : ""
        )}
      >
        {textContent && (
          <div
            className={cn(
              "px-4 py-3 rounded-2xl transition-smooth",
              isAssistant
                ? "glass-effect border border-border"
                : "gradient-primary shadow-glow"
            )}
          >
            <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
              {textContent}
            </p>
          </div>
        )}
        
        {rawUrl && (
          <div className="rounded-2xl overflow-hidden shadow-glow border border-border">
            {isDirectVideoFile(rawUrl) ? (
              <video
                src={rawUrl}
                className="w-full h-auto"
                autoPlay
                muted
                loop
                controls
                playsInline
              />
            ) : (
              <iframe
                src={rawUrl}
                className="w-full aspect-video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        )}

        {rawUrl && (
          <a
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm md:text-base text-primary underline underline-offset-4 break-all"
          >
            {rawUrl}
          </a>
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
