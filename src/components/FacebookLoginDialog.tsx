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
}

export const FacebookLoginDialog = ({ open, onOpenChange }: FacebookLoginDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      // Call your backend API for Facebook OAuth
      const response = await fetch(`${API_BASE_URL}/auth/facebook/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Facebook login failed");
      }

      const data = await response.json();
      
      // Store auth token if provided
      if (data.access_token) {
        localStorage.setItem("auth_token", data.access_token);
      }

      toast.success("התחברת בהצלחה!");
      
      // Redirect to main app
      navigate("/app");
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("התחברות נכשלה. נסה שוב.");
    } finally {
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
