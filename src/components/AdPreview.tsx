import { useState, useCallback, useRef } from "react";
import { Upload, X, Play, MoreHorizontal, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdData {
  media?: string;
  mediaType?: "image" | "video";
  headline: string;
  primaryText: string;
  buttonText: string;
}

interface AdPreviewProps {
  adData: AdData;
  onUpdate?: (data: AdData) => void;
  editable?: boolean;
}

export const AdPreview = ({ adData, onUpdate, editable = false }: AdPreviewProps) => {
  const [localData, setLocalData] = useState<AdData>(adData);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newData = { ...localData, media: event.target?.result as string, mediaType: "image" as const };
          setLocalData(newData);
          onUpdate?.(newData);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newData = { ...localData, media: event.target?.result as string, mediaType: "video" as const };
          setLocalData(newData);
          onUpdate?.(newData);
        };
        reader.readAsDataURL(file);
      }
    },
    [localData, onUpdate]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newData = { ...localData, media: event.target?.result as string, mediaType: "image" as const };
        setLocalData(newData);
        onUpdate?.(newData);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newData = { ...localData, media: event.target?.result as string, mediaType: "video" as const };
        setLocalData(newData);
        onUpdate?.(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveMedia = () => {
    const newData = { ...localData, media: undefined, mediaType: undefined };
    setLocalData(newData);
    onUpdate?.(newData);
  };

  const handleTextChange = (field: keyof AdData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onUpdate?.(newData);
  };

  return (
    <div className="w-full max-w-md bg-card rounded-lg overflow-hidden border border-border shadow-lg">
      {/* Facebook-style Ad Container */}
      <div className="space-y-0">
        {/* Profile Header (Facebook style) */}
        <div className="flex items-center gap-3 p-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">הדף שלך</p>
              <span className="text-xs text-muted-foreground">· ממומן</span>
            </div>
          </div>
          <button className="w-9 h-9 rounded-full hover:bg-muted/50 flex items-center justify-center transition-smooth">
            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Primary Text */}
        <div className="px-3 pb-3">
          {editable ? (
            <textarea
              value={localData.primaryText}
              onChange={(e) => handleTextChange("primaryText", e.target.value)}
              className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary transition-smooth"
              rows={3}
              placeholder="הטקסט הראשי של המודעה..."
            />
          ) : (
            <p className="text-[15px] leading-snug">{localData.primaryText}</p>
          )}
        </div>

        {/* Media Section */}
        <div
          className={cn(
            "relative w-full aspect-[4/3] rounded-lg overflow-hidden transition-smooth cursor-pointer",
            isDragging && "ring-2 ring-primary ring-offset-2",
            !localData.media && editable && "border-2 border-dashed border-border bg-secondary/20"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => editable && !localData.media && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          {localData.media ? (
            <>
              {localData.mediaType === "image" ? (
                <img src={localData.media} alt="Ad media" className="w-full h-full object-cover" />
              ) : (
                <div className="relative w-full h-full bg-black/90">
                  <video src={localData.media} className="w-full h-full object-contain" controls={false} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-8 h-8 text-black mr-1" />
                    </div>
                  </div>
                </div>
              )}
              {editable && (
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-smooth"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </>
          ) : editable ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Upload className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">גרור תמונה או סרטון לכאן</p>
                <p className="text-xs text-muted-foreground mt-1">או לחץ לבחירה</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-secondary/40 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">ללא מדיה</p>
            </div>
          )}
        </div>

        {/* Ad Details Card - Facebook style link preview */}
        <div className="bg-muted/30 border-t border-border p-3 space-y-2.5">
          {editable ? (
            <>
              <input
                value={localData.headline}
                onChange={(e) => handleTextChange("headline", e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary transition-smooth"
                placeholder="כותרת המודעה..."
              />
              <p className="text-xs text-muted-foreground">yourwebsite.com</p>
              <input
                value={localData.buttonText}
                onChange={(e) => handleTextChange("buttonText", e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-smooth"
                placeholder="טקסט הכפתור..."
              />
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">yourwebsite.com</p>
              <p className="text-[15px] font-semibold line-clamp-2 leading-tight">{localData.headline}</p>
              <button className="w-full bg-muted/70 hover:bg-muted text-foreground font-semibold py-2 px-4 rounded-md text-sm transition-smooth">
                {localData.buttonText}
              </button>
            </>
          )}
        </div>

        {/* Facebook Engagement Bar */}
        <div className="border-t border-border px-3 py-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-1">
              <ThumbsUp className="w-3.5 h-3.5" />
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-xs">0</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 hover:text-foreground transition-smooth py-1.5">
                <ThumbsUp className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">אהבתי</span>
              </button>
              <button className="flex items-center gap-2 hover:text-foreground transition-smooth py-1.5">
                <MessageCircle className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">תגובה</span>
              </button>
              <button className="flex items-center gap-2 hover:text-foreground transition-smooth py-1.5">
                <Share2 className="w-[18px] h-[18px]" />
                <span className="text-sm font-medium">שיתוף</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
