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
const HARDCODED_VIDEO_URL = "https://player.vimeo.com/video/1134891779?h=1da09c504f";

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";
  const rawUrl = isAssistant ? extractFirstUrl(message.content) : null;
  const showHardcodedVideo = isAssistant && message.content.includes("סרטון");
  const videoSource = showHardcodedVideo ? HARDCODED_VIDEO_URL : rawUrl;
  const textContent =
    rawUrl && !showHardcodedVideo ? removeUrlFromText(message.content) : showHardcodedVideo ? "" : message.content;
  console.log("chat video url", rawUrl);

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
        
        {videoSource && (
          <div className="rounded-2xl overflow-hidden shadow-glow border border-border">
            {isDirectVideoFile(videoSource) ? (
              <video
                src={videoSource}
                className="w-full h-auto"
                autoPlay
                muted
                loop
                controls
                playsInline
              />
            ) : (
              <iframe
                src={videoSource}
                className="w-full aspect-video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
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
