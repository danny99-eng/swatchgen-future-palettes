import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ColorSwatchProps {
  hex: string;
  rgb: string;
  name: string;
}

const ColorSwatch = ({ hex, rgb, name }: ColorSwatchProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="glass-card p-4 space-y-3 hover-lift animate-fade-in">
      <div
        className="h-32 rounded-xl shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer"
        style={{ backgroundColor: hex }}
        onClick={() => handleCopy(hex, 'HEX')}
      />
      <div className="space-y-2">
        <p className="font-semibold text-sm truncate">{name}</p>
        
        <div className="flex items-center justify-between gap-2">
          <code className="text-sm text-muted-foreground font-mono">
            {hex}
          </code>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => handleCopy(hex, 'HEX')}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          RGB: {rgb}
        </p>
      </div>
    </div>
  );
};

export default ColorSwatch;
