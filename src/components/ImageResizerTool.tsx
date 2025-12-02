import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, RefreshCw, Minimize2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ImageResizerTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Image stats
    const [originalSize, setOriginalSize] = useState<{ width: number; height: number; size: number } | null>(null);
    const [processedSize, setProcessedSize] = useState<{ width: number; height: number; size: number } | null>(null);

    // Controls
    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
    const [quality, setQuality] = useState(80);
    const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
    const [aspectRatio, setAspectRatio] = useState<number>(1);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (uploadedFile: File) => {
        if (!uploadedFile.type.startsWith("image/")) {
            toast.error("Please upload a valid image file");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setFile(uploadedFile);
                setPreviewUrl(e.target?.result as string);
                setOriginalSize({
                    width: img.width,
                    height: img.height,
                    size: uploadedFile.size
                });

                // Reset controls
                setWidth(img.width);
                setHeight(img.height);
                setAspectRatio(img.width / img.height);
                setProcessedUrl(null);
                setProcessedSize(null);
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(uploadedFile);
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value) || 0;
        setWidth(newWidth);
        if (maintainAspectRatio) {
            setHeight(Math.round(newWidth / aspectRatio));
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value) || 0;
        setHeight(newHeight);
        if (maintainAspectRatio) {
            setWidth(Math.round(newHeight * aspectRatio));
        }
    };

    const processImage = async () => {
        if (!file || !previewUrl) return;

        setIsProcessing(true);

        try {
            const img = new Image();
            img.src = previewUrl;

            await new Promise((resolve) => { img.onload = resolve; });

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get canvas context");

            // Better quality resizing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        toast.error("Failed to process image");
                        setIsProcessing(false);
                        return;
                    }

                    const newUrl = URL.createObjectURL(blob);
                    setProcessedUrl(newUrl);
                    setProcessedSize({
                        width,
                        height,
                        size: blob.size
                    });
                    setIsProcessing(false);
                    toast.success("Image processed successfully!");
                },
                format,
                quality / 100
            );
        } catch (error) {
            console.error("Processing error:", error);
            toast.error("Failed to process image");
            setIsProcessing(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFormatExtension = (mimeType: string) => {
        switch (mimeType) {
            case "image/jpeg": return "jpg";
            case "image/png": return "png";
            case "image/webp": return "webp";
            default: return "jpg";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Image Resizer & Compressor</h3>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Work Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Upload/Preview Area */}
                    <div
                        className={cn(
                            "min-h-[400px] rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 relative overflow-hidden",
                            file ? "border-border bg-card/50" : "border-primary/20 hover:border-primary/50 bg-muted/30 cursor-pointer"
                        )}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => !file && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {!file ? (
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                    <Upload className="w-10 h-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">Drop your image here</h3>
                                <p className="text-muted-foreground">or click to browse</p>
                                <p className="text-xs text-muted-foreground mt-4">Supports JPG, PNG, WEBP</p>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center">
                                <div className="relative max-w-full max-h-[500px] rounded-lg overflow-hidden shadow-lg mb-6">
                                    <img
                                        src={processedUrl || previewUrl || ""}
                                        alt="Preview"
                                        className="max-w-full max-h-[500px] object-contain"
                                    />
                                    {processedUrl && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-fade-in">
                                            Processed
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={() => {
                                        setFile(null);
                                        setPreviewUrl(null);
                                        setProcessedUrl(null);
                                        setProcessedSize(null);
                                    }}>
                                        Upload New Image
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stats Comparison */}
                    {file && originalSize && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-card p-4 rounded-xl">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Original</h4>
                                <div className="space-y-1">
                                    <p className="text-2xl font-bold">{formatSize(originalSize.size)}</p>
                                    <p className="text-sm text-muted-foreground">{originalSize.width} x {originalSize.height}px</p>
                                </div>
                            </div>
                            <div className="glass-card p-4 rounded-xl border-primary/20">
                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Output</h4>
                                <div className="space-y-1">
                                    <p className={cn("text-2xl font-bold", processedSize && processedSize.size < originalSize.size ? "text-green-500" : "")}>
                                        {processedSize ? formatSize(processedSize.size) : "---"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {processedSize ? `${processedSize.width} x ${processedSize.height}px` : `${width} x ${height}px`}
                                    </p>
                                    {processedSize && (
                                        <p className="text-xs text-green-500 font-medium">
                                            {Math.round((1 - processedSize.size / originalSize.size) * 100)}% reduction
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls Sidebar */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 rounded-2xl space-y-8 sticky top-24">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Minimize2 className="w-5 h-5" />
                                Resize Settings
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Width (px)</Label>
                                        <Input
                                            type="number"
                                            value={width || ""}
                                            onChange={handleWidthChange}
                                            disabled={!file}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Height (px)</Label>
                                        <Input
                                            type="number"
                                            value={height || ""}
                                            onChange={handleHeightChange}
                                            disabled={!file}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
                                    <Switch
                                        id="aspect-ratio"
                                        checked={maintainAspectRatio}
                                        onCheckedChange={setMaintainAspectRatio}
                                        disabled={!file}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <RefreshCw className="w-5 h-5" />
                                Compression
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label>Quality</Label>
                                        <span className="text-sm text-muted-foreground">{quality}%</span>
                                    </div>
                                    <Slider
                                        value={[quality]}
                                        onValueChange={(val) => setQuality(val[0])}
                                        min={1}
                                        max={100}
                                        step={1}
                                        disabled={!file}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Format</Label>
                                    <Select
                                        value={format}
                                        onValueChange={(val: any) => setFormat(val)}
                                        disabled={!file}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="image/jpeg">JPEG</SelectItem>
                                            <SelectItem value="image/png">PNG</SelectItem>
                                            <SelectItem value="image/webp">WebP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={processImage}
                                disabled={!file || isProcessing}
                            >
                                {isProcessing ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Process Image
                                    </>
                                )}
                            </Button>

                            {processedUrl && (
                                <a
                                    href={processedUrl}
                                    download={`processed-image.${getFormatExtension(format)}`}
                                    className="block w-full"
                                >
                                    <Button variant="secondary" className="w-full" size="lg">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Result
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageResizerTool;
