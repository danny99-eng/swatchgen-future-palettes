import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ColorData } from '@/lib/colorExtraction';
import { generateGradientsFromColors, GradientData } from '@/lib/gradientExtraction';
import ImageUpload from './ImageUpload';

interface GradientGeneratorProps {
  colors: ColorData[];
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
  onSaveGradient?: (gradient: GradientData) => void;
}

const GradientGenerator = ({ colors, onImageUpload, isProcessing, onSaveGradient }: GradientGeneratorProps) => {
  const [gradients, setGradients] = useState<GradientData[]>([]);
  const [selectedGradient, setSelectedGradient] = useState<GradientData | null>(null);

  useEffect(() => {
    if (colors.length >= 2) {
      const generated = generateGradientsFromColors(colors);
      setGradients(generated);
      setSelectedGradient(generated[0] || null);
    }
  }, [colors]);

  const copyCSS = (css: string) => {
    navigator.clipboard.writeText(css);
    toast.success('CSS copied to clipboard!');
  };

  const handleSave = (gradient: GradientData) => {
    if (onSaveGradient) {
      onSaveGradient(gradient);
    }
  };

  if (gradients.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold">Gradient Generator</h3>
        <p className="text-muted-foreground">Upload an image to generate beautiful gradients from its colors.</p>
        <ImageUpload onImageUpload={onImageUpload} isProcessing={isProcessing} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold">Generated Gradients</h3>
      
      {/* Main gradient display */}
      {selectedGradient && (
        <div className="space-y-4">
          <div
            className="h-64 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02]"
            style={{ background: selectedGradient.css }}
          />
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              onClick={() => copyCSS(selectedGradient.css)}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy CSS
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(selectedGradient)}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Gradient
            </Button>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-2">{selectedGradient.name}</p>
            <code className="text-xs break-all">{selectedGradient.css}</code>
          </div>
        </div>
      )}

      {/* Gradient grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gradients.map((gradient) => (
          <button
            key={gradient.id}
            onClick={() => setSelectedGradient(gradient)}
            className={`h-32 rounded-xl transition-all duration-300 hover:scale-105 ${
              selectedGradient?.id === gradient.id ? 'ring-4 ring-primary' : ''
            }`}
            style={{ background: gradient.css }}
          />
        ))}
      </div>

      <Button
        variant="outline"
        onClick={() => {
          setGradients([]);
          setSelectedGradient(null);
        }}
        className="w-full"
      >
        Generate from New Image
      </Button>
    </div>
  );
};

export default GradientGenerator;
