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
  description?: string;
  buttonText: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  showFacebookLogin?: boolean;
  showCampaignReadyButton?: boolean; // Show "הקמפיין מוכן" button
  adPreview?: AdData;
  isStrategyAd?: boolean;
  strategyAds?: AdData[]; // Multiple ads from strategy (up to 3)
}

interface ChatMessageProps {
  message: Message;
  onAdUploadComplete?: (urls: string[]) => void;
  conversationId?: string | null;
  onCampaignReady?: () => void;
  onStrategyAdUpdate?: (adIndex: number, updatedAd: AdData) => void;
}

export const ChatMessage = ({ message, onAdUploadComplete, conversationId, onCampaignReady, onStrategyAdUpdate }: ChatMessageProps) => {
  const isAssistant = message.role === "assistant";
  const navigate = useNavigate();
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);

  const handleFacebookLogin = async () => {
    setIsFacebookLoading(true);
    try {
      const query = conversationId ? `?conversation_id=${encodeURIComponent(conversationId)}` : "";
      const response = await fetch(`${API_BASE_URL}/auth/facebook/login${query}`, {
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
        // Accept messages from our frontend origin and backend origins (local + Render)
        const allowedOrigins = [
          window.location.origin,
          "http://localhost:8000",
          "https://campaigner-ai-backend.onrender.com",
        ];
        if (!allowedOrigins.includes(event.origin)) return;

        if (event.data.type === "facebook_auth_success") {
          // Store only tokens in localStorage
          const user = event.data.user;
          const token = event.data.access_token || user?.access_token;
          const refreshToken = user?.refresh_token;
          const expiresAt = user?.expires_at;

          if (token) {
            localStorage.setItem("auth_token", token);
          }
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }
          if (expiresAt) {
            localStorage.setItem("token_expires_at", expiresAt);
          }

          console.log("FB success payload (chat):", event.data);
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
        {message.content && (
          <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        )}
        {/* Render multiple strategy ads */}
        {message.strategyAds && message.strategyAds.length > 0 && (
          <div className="mt-4 space-y-4">
            {message.strategyAds.map((ad, index) => (
              <AdPreview
                key={index}
                adData={ad}
                editable={false}
                showSubmitButton={false}
                mediaOnly={false}
                onUpdate={(updatedAd) => {
                  if (onStrategyAdUpdate) {
                    onStrategyAdUpdate(index, updatedAd);
                  }
                }}
              />
            ))}
          </div>
        )}
        {/* Render single ad preview (for backward compatibility) */}
        {message.adPreview && !message.strategyAds && (
          <div className="mt-4">
            <AdPreview
              adData={message.adPreview}
              editable={!message.isStrategyAd}
              showSubmitButton={!message.isStrategyAd}
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
        {message.showCampaignReadyButton && (
          <Button
            onClick={() => {
              if (onCampaignReady) {
                onCampaignReady();
              }
            }}
            className="mt-4 w-full min-w-[300px] py-6 px-8 text-lg font-semibold gradient-primary shadow-glow transition-smooth hover:shadow-[0_12px_30px_rgba(56,189,248,0.45)] hover:translate-y-[-1px]"
          >
            הקמפיין מוכן
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
