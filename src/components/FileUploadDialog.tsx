import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, FileVideo, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFilesSelected: (files: File[]) => void;
}

export const FileUploadDialog = ({ open, onOpenChange, onFilesSelected }: FileUploadDialogProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
      );
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
      setSelectedFiles([]);
      onOpenChange(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">העלאת קבצים לקמפיין</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Drag and Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-2xl p-12 text-center transition-smooth cursor-pointer hover:border-primary/50",
              dragActive ? "border-primary bg-primary/5" : "border-border/50 bg-secondary/30"
            )}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center shadow-glow">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    גרור ושחרר קבצים כאן
                  </p>
                  <p className="text-sm text-muted-foreground">
                    או לחץ לבחירת קבצים
                  </p>
                  <p className="text-xs text-muted-foreground">
                    תמונות או סרטונים בלבד
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">
                קבצים שנבחרו ({selectedFiles.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg glass-effect border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="w-5 h-5 text-primary" />
                      ) : (
                        <FileVideo className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedFiles([]);
                onOpenChange(false);
              }}
            >
              ביטול
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={selectedFiles.length === 0}
              className="gradient-primary shadow-glow"
            >
              המשך עם {selectedFiles.length} קבצים
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
