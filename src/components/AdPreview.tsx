import { useState, useCallback, useEffect } from "react";
import { Upload, X, Play, ThumbsUp, MessageCircle, Share2, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUploadDialog } from "./FileUploadDialog";
import { uploadAdMedia } from "@/services/adService";

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

interface AdPreviewProps {
  adData: AdData;
  onUpdate?: (data: AdData) => void;
  editable?: boolean;
  showSubmitButton?: boolean;
  mediaOnly?: boolean;
  onUploadComplete?: (urls: string[]) => void;
}

export const AdPreview = ({ adData, onUpdate, editable = false, showSubmitButton = false, mediaOnly = false, onUploadComplete }: AdPreviewProps) => {
  const [localData, setLocalData] = useState<AdData>(adData);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Update localData when adData prop changes
  useEffect(() => {
    console.log("AdPreview received adData:", adData);
    console.log("AdPreview media:", adData.media);
    console.log("AdPreview media type:", typeof adData.media);
    console.log("AdPreview media is array:", Array.isArray(adData.media));
    console.log("AdPreview media length:", adData.media?.length);
    if (adData.media && adData.media.length > 0) {
      console.log("AdPreview first media item:", adData.media[0]);
      console.log("AdPreview first media URL:", adData.media[0]?.url);
    }
    setLocalData(adData);
  }, [adData]);
  
  // Determine if fields should be editable (either from prop or edit mode)
  const isEditable = editable || isEditing;

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      const mediaItems: MediaItem[] = [];
      let processedCount = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          const type = file.type.startsWith("image/") ? "image" : "video";
          mediaItems.push({ url, type });
          
          processedCount++;
          if (processedCount === files.length) {
            const newData = { 
              ...localData, 
              media: [...(localData.media || []), ...mediaItems] 
            };
            setLocalData(newData);
            onUpdate?.(newData);
          }
        };
        reader.readAsDataURL(file);
      });

      setUploadedFiles((prev) => [...prev, ...files]);
    },
    [localData, onUpdate]
  );

  const handleRemoveMedia = (index: number) => {
    const newMedia = localData.media?.filter((_, i) => i !== index);
    const newData = { ...localData, media: newMedia };
    setLocalData(newData);
    onUpdate?.(newData);
    
    if (currentMediaIndex >= (newMedia?.length || 0) && currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => 
      Math.min((localData.media?.length || 1) - 1, prev + 1)
    );
  };

  const handleTextChange = (field: keyof AdData, value: string) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onUpdate?.(newData);
  };

  const handleSubmit = async () => {
    if (!uploadedFiles.length) return;
    try {
      setIsSubmitting(true);
      const res = await uploadAdMedia(uploadedFiles);
      if (res.media_urls?.length && onUploadComplete) {
        onUploadComplete(res.media_urls);
      }
    } catch (err) {
      console.error("Failed to upload ad media:", err);
    } finally {
      setIsSubmitting(false);
    }
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
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "w-9 h-9 rounded-full hover:bg-muted/50 flex items-center justify-center transition-smooth",
              isEditing && "bg-primary/20"
            )}
            title={isEditing ? "סיים עריכה" : "ערוך"}
          >
            <span className={cn("text-lg transition-smooth", isEditing ? "text-primary" : "text-muted-foreground")}>
              {isEditing ? "✓" : "✎"}
            </span>
          </button>
        </div>

        {/* Primary Text */}
        {!mediaOnly && (
          <div className="px-3 pb-3 space-y-2">
            {isEditable ? (
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
            {/* Description Text */}
            {localData.description && (
              <>
                {isEditable ? (
                  <textarea
                    value={localData.description}
                    onChange={(e) => handleTextChange("description", e.target.value)}
                    className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary transition-smooth"
                    rows={2}
                    placeholder="תיאור נוסף..."
                  />
                ) : (
                  <p className="text-[14px] text-muted-foreground leading-snug">{localData.description}</p>
                )}
              </>
            )}
            {/* Show description input even if empty when editing */}
            {isEditable && !localData.description && (
              <textarea
                value=""
                onChange={(e) => handleTextChange("description", e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-primary transition-smooth"
                rows={2}
                placeholder="תיאור נוסף (אופציונלי)..."
              />
            )}
          </div>
        )}

        {/* Media Section */}
        <div className="relative w-full aspect-[4/3] bg-secondary/20 overflow-hidden">
          {localData.media && Array.isArray(localData.media) && localData.media.length > 0 ? (
            <>
              {/* Current Media Display */}
              <div className="w-full h-full relative">
                {localData.media[currentMediaIndex].type === "image" ? (
                  <>
                    <img 
                      src={localData.media[currentMediaIndex].url} 
                      alt="Ad media" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        console.error("❌ Failed to load image from URL:", localData.media[currentMediaIndex].url);
                        console.error("Image element:", img);
                        console.error("Image src attribute:", img.src);
                        console.error("Image complete:", img.complete);
                        console.error("Image naturalWidth:", img.naturalWidth);
                        console.error("Image naturalHeight:", img.naturalHeight);
                        // Hide broken image and show error message
                        img.style.display = "none";
                        const errorDiv = img.nextElementSibling as HTMLElement;
                        if (errorDiv && errorDiv.classList.contains("image-error")) {
                          errorDiv.style.display = "flex";
                        }
                      }}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        console.log("✅ Image loaded successfully:", localData.media[currentMediaIndex].url);
                        console.log("Image dimensions:", img.naturalWidth, "x", img.naturalHeight);
                        // Hide error message if image loads
                        const errorDiv = img.nextElementSibling as HTMLElement;
                        if (errorDiv && errorDiv.classList.contains("image-error")) {
                          errorDiv.style.display = "none";
                        }
                      }}
                    />
                    {/* Error fallback - shown when image fails to load */}
                    <div className="image-error absolute inset-0 bg-secondary/40 flex flex-col items-center justify-center p-4 text-center" style={{ display: "none" }}>
                      <p className="text-sm text-muted-foreground mb-2">לא ניתן לטעון את התמונה</p>
                      <p className="text-xs text-muted-foreground break-all">{localData.media[currentMediaIndex].url}</p>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full bg-black/90">
                    <video 
                      src={localData.media[currentMediaIndex].url} 
                      className="w-full h-full object-contain" 
                      controls={false} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-8 h-8 text-black mr-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {localData.media.length > 1 && (
                <>
                  <button
                    onClick={handlePrevMedia}
                    disabled={currentMediaIndex === 0}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextMedia}
                    disabled={currentMediaIndex === localData.media.length - 1}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-smooth disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                </>
              )}

              {/* Media Counter */}
              {localData.media.length > 1 && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                  <p className="text-xs text-white font-medium">
                    {currentMediaIndex + 1} / {localData.media.length}
                  </p>
                </div>
              )}

              {/* Remove Current Media Button */}
              {editable && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveMedia(currentMediaIndex);
                  }}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-smooth z-10"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}

              {/* Add More Button */}
              {editable && localData.media.length < 10 && (
                <button
                  onClick={() => setShowUploadDialog(true)}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary/90 backdrop-blur-sm flex items-center gap-2 hover:bg-primary transition-smooth shadow-glow"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span className="text-sm text-white font-medium">
                    הוסף עוד ({localData.media.length}/10)
                  </span>
                </button>
              )}
            </>
          ) : editable ? (
            <button
              onClick={() => setShowUploadDialog(true)}
              className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center hover:bg-secondary/30 transition-smooth"
            >
              <Upload className="w-10 h-10 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">העלה תמונות או סרטונים</p>
                <p className="text-xs text-muted-foreground mt-1">עד 10 קבצים</p>
              </div>
            </button>
          ) : (
            <div className="w-full h-full bg-secondary/40 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">ללא מדיה</p>
            </div>
          )}
        </div>

        {/* File Upload Dialog */}
        {editable && (
          <FileUploadDialog
            open={showUploadDialog}
            onOpenChange={setShowUploadDialog}
            onFilesSelected={handleFilesSelected}
          />
        )}

        {/* Ad Details Card - Facebook style link preview */}
        {!mediaOnly && (
          <div className="bg-muted/30 border-t border-border p-3 space-y-2.5">
            {isEditable ? (
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
        )}

        {/* Facebook Engagement Bar */}
        {!mediaOnly && (
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
        )}
      </div>

      {/* Submit Button */}
      {showSubmitButton && (
        <div className="mt-4">
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (mediaOnly
                ? !localData.media || localData.media.length === 0
                : !localData.headline || !localData.primaryText || !localData.buttonText)
            }
            className="w-full gradient-primary shadow-glow transition-smooth hover:shadow-[0_12px_30px_rgba(56,189,248,0.45)] hover:translate-y-[-1px]"
            size="lg"
          >
            <CheckCircle2 className="w-5 h-5 ml-2" />
            {isSubmitting ? "מעלה..." : "המודעה מוכנה"}
          </Button>
        </div>
      )}
    </div>
  );
};
