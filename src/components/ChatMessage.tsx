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

const extractVideoUrl = (text: string): string | null => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  
  if (!urls || urls.length === 0) return null;
  
  const url = urls[0];
  
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : null;
  }
  
  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1` : null;
  }
  
  // Generic video file
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return url;
  }
  
  return null;
};

const removeUrlFromText = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '').trim();
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";
  const videoUrl = isAssistant ? extractVideoUrl(message.content) : null;
  const textContent = videoUrl ? removeUrlFromText(message.content) : message.content;

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
        
        {videoUrl && (
          <div className="rounded-2xl overflow-hidden shadow-glow border border-border">
            <iframe
              src={videoUrl}
              className="w-full aspect-video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
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
