import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { API_BASE_URL } from "@/constants/api";

interface ContactDetailsDialogProps {
  open: boolean;
  onClose?: () => void;
  userId?: string | number;
  onSuccess?: () => void;
}

export const ContactDetailsDialog = ({
  open,
  onClose,
  userId,
  onSuccess,
}: ContactDetailsDialogProps) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
      setError("כל השדות חובה");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("כתובת אימייל לא תקינה");
      return;
    }

    // Israeli phone number validation
    // Must be 10 digits, start with 0, followed by 9 more digits
    // Valid prefixes: 02, 03, 04, 05x, 08, 09 (where x is 0-9 for mobile)
    const phoneDigitsOnly = phoneNumber.replace(/\D/g, "");
    const israeliPhoneRegex = /^0[1-9]\d{8}$/;
    if (!israeliPhoneRegex.test(phoneDigitsOnly)) {
      setError("מספר טלפון ישראלי לא תקין. השתמש בפורמט: 050-1234567 או 051234567");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Sending contact details to:", `${API_BASE_URL}/api/users/contact-details`);
      console.log("User ID:", userId);
      
      // Get auth token from localStorage for authorization
      const authToken = localStorage.getItem("auth_token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }
      
      // Send request without waiting for response - close modal immediately
      fetch(`${API_BASE_URL}/api/users/contact-details`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          full_name: fullName,
          phone_number: phoneNumber,
          email: email,
          user_id: userId,
        }),
      }).then(response => {
        if (response.ok) {
          console.log("Contact details saved successfully");
        } else {
          console.error("Backend returned error:", response.status);
        }
      }).catch(err => {
        console.error("Request sent (background):", err);
      });

      // Clear form immediately
      setFullName("");
      setPhoneNumber("");
      setEmail("");
      
      // Close dialog immediately
      if (onClose) {
        onClose();
      }
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Contact details error:", err);
      setError(
        err instanceof Error ? err.message : "שגיאה בשמירת הפרטים"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <AlertDialogContent className="max-w-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-right">פרטים ליצירת קשר</h2>
          <p className="text-sm text-gray-500 text-right mt-2">
            אנא מלא את הפרטים שלך כדי להמשיך
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-right block">
              שם מלא
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="הכנס שם מלא"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              dir="rtl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-right block">
              מספר טלפון
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="הכנס מספר טלפון"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading}
              dir="ltr"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-right block">
              כתובת אימייל
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="הכנס כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              dir="ltr"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-right">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "שומר..." : "שמור פרטים"}
          </Button>
        </form>

        <style>{`
          [data-state="open"] {
            pointer-events: auto;
          }
          [data-state="open"] [role="dialog"] {
            pointer-events: auto;
          }
        `}</style>
      </AlertDialogContent>
    </AlertDialog>
  );
};
