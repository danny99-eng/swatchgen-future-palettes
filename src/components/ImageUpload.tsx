import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing?: boolean;
}

const ImageUpload = ({ onImageUpload, isProcessing = false }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Image size should be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onImageUpload(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const clearImage = useCallback(() => {
    setPreview(null);
  }, []);

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
            ${isDragging 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border hover:border-primary/50 hover:bg-accent/30'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={isProcessing}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-4">
              {isProcessing ? (
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
              ) : (
                <Upload className="w-16 h-16 text-muted-foreground" />
              )}
              <div>
                <p className="text-lg font-semibold mb-1">
                  {isProcessing ? 'Processing image...' : 'Drag & drop your image here'}
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse (Max 10MB)
                </p>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="relative glass-card p-4 animate-fade-in">
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 z-10"
            onClick={clearImage}
            disabled={isProcessing}
          >
            <X className="w-4 h-4" />
          </Button>
          <img
            src={preview}
            alt="Uploaded preview"
            className="w-full rounded-xl max-h-96 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
