import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdPreview } from "@/components/AdPreview";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants/api";

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
  onAdUploadComplete?: (urls: string[]) => void;
}

export const ChatMessage = ({ message, onAdUploadComplete }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";
  const navigate = useNavigate();
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/facebook/login`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to get Facebook login URL");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("No login URL received");
      }

      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        data.url,
        "Facebook Login",
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
      );

      if (!popup) {
        toast.error("חלון הפופאפ נחסם. אנא אפשר פופאפים.");
        setIsFacebookLoading(false);
        return;
      }

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "facebook_auth_success") {
          if (event.data.access_token) {
            localStorage.setItem("auth_token", event.data.access_token);
          }

          toast.success("התחברת בהצלחה!");
          navigate("/app");
          window.removeEventListener("message", handleMessage);
        } else if (event.data.type === "facebook_auth_error") {
          toast.error("התחברות נכשלה. נסה שוב.");
          setIsFacebookLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener("message", handleMessage);
          setIsFacebookLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("התחברות נכשלה. נסה שוב.");
      setIsFacebookLoading(false);
    }
  };

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
              onUploadComplete={onAdUploadComplete}
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
            onClick={handleFacebookLogin}
            disabled={isFacebookLoading}
            className="mt-4 w-full gradient-primary shadow-glow transition-smooth hover:shadow-[0_12px_30px_rgba(56,189,248,0.45)] hover:translate-y-[-1px]"
          >
            {isFacebookLoading ? "מתחבר..." : "Login with facebook"}
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
