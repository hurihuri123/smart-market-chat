import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Facebook } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants/api";

interface FacebookLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const FacebookLoginDialog = ({ open, onOpenChange, onSuccess }: FacebookLoginDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      // Get Facebook OAuth URL from backend
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

      // Open Facebook OAuth in a popup window
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
        setIsLoading(false);
        return;
      }

      // Listen for messages from the popup (after OAuth redirect)
      const handleMessage = (event: MessageEvent) => {
        // Verify origin for security
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === "facebook_auth_success") {
          if (event.data.access_token) {
            localStorage.setItem("auth_token", event.data.access_token);
          }
          
          toast.success("התחברת בהצלחה!");
          onSuccess?.();
          navigate("/app");
          window.removeEventListener("message", handleMessage);
        } else if (event.data.type === "facebook_auth_error") {
          toast.error("התחברות נכשלה. נסה שוב.");
          setIsLoading(false);
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      // Check if popup was closed without completing auth
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          window.removeEventListener("message", handleMessage);
          setIsLoading(false);
        }
      }, 500);

    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("התחברות נכשלה. נסה שוב.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-effect border-primary/30">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text text-center">
            🎉 מעולה!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            כדי להמשיך ולהתחיל להריץ את הקמפיינים שלך, התחבר עם Facebook
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-6">
          <Button
            onClick={handleFacebookLogin}
            disabled={isLoading}
            size="lg"
            className="w-full gradient-primary shadow-glow hover:shadow-[0_12px_30px_rgba(56,189,248,0.45)] transition-smooth"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                מתחבר...
              </>
            ) : (
              <>
                <Facebook className="w-5 h-5 ml-2" />
                התחבר עם Facebook
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            נשתמש בחשבון Facebook שלך כדי להריץ ולנהל את הקמפיינים שלך
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
