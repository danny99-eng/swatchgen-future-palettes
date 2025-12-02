import { useState, useRef } from "react";
import { generateMoodboard, MoodboardResult } from "@/lib/moodboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Wand2, Palette, Type } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

export const MoodboardGenerator = () => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MoodboardResult | null>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt");
            return;
        }

        setLoading(true);
        try {
            const data = await generateMoodboard(prompt);
            setResult(data);
            toast.success("Moodboard generated successfully!");
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to generate moodboard");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!boardRef.current) return;

        try {
            const canvas = await html2canvas(boardRef.current, {
                useCORS: true,
                scale: 2,
                backgroundColor: "#ffffff"
            });

            const link = document.createElement("a");
            link.download = `moodboard-${prompt.replace(/\s+/g, "-")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast.success("Moodboard downloaded!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to download moodboard");
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 p-6">
            {/* Input Section */}
            <div className="text-center space-y-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        AI Moodboard Generator
                    </h3>
                    <p className="text-muted-foreground">
                        Describe your vision and let AI create a visual moodboard for you.
                    </p>
                </div>

                <div className="flex gap-4 max-w-xl mx-auto">
                    <Input
                        placeholder="e.g., Minimalist tropical luxury brand"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="h-12 text-lg bg-white/50 dark:bg-black/20"
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    />
                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5 mr-2" />
                                Generate
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-square bg-muted rounded-xl" />
                    ))}
                </div>
            )}

            {/* Results Section */}
            {result && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={handleDownload} className="gap-2">
                            <Download className="w-4 h-4" />
                            Download Board
                        </Button>
                    </div>

                    <div ref={boardRef} className="bg-white dark:bg-background p-8 rounded-xl shadow-2xl space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold capitalize">{prompt}</h3>
                            <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
                        </div>

                        {/* Image Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            {result.images.map((url, i) => (
                                <div key={i} className="aspect-square rounded-lg overflow-hidden shadow-md">
                                    <img
                                        src={url}
                                        alt={`Moodboard ${i + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        crossOrigin="anonymous"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Palette */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Palette className="w-5 h-5" />
                                <span className="font-medium">Color Palette</span>
                            </div>
                            <div className="flex h-24 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5">
                                {result.palette.map((color, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex items-end justify-center pb-2 group relative"
                                        style={{ backgroundColor: color }}
                                    >
                                        <span className="bg-white/90 dark:bg-black/90 px-2 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                            {color}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Typography */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Type className="w-5 h-5" />
                                <span className="font-medium">Typography</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="p-6 bg-muted/30 border-none">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Headline</span>
                                    <p className="text-3xl font-bold mt-2" style={{ fontFamily: result.fonts.headline }}>
                                        {result.fonts.headline}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        The quick brown fox jumps over the lazy dog
                                    </p>
                                </Card>
                                <Card className="p-6 bg-muted/30 border-none">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Body</span>
                                    <p className="text-xl mt-2" style={{ fontFamily: result.fonts.body }}>
                                        {result.fonts.body}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </p>
                                </Card>
                            </div>
                            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/50 pl-4">
                                "{result.fonts.notes}"
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
