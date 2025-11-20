import { Image, Thermometer, Waves, Share2, ImageDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Image,
    title: "Image Color Extraction",
    description: "Upload any image and instantly extract 3-8 dominant colors with precise HEX and RGB values.",
    demo: (
      <div className="space-y-3">
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
          <Image className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
        </div>
        <div className="flex gap-2">
          {['#2563EB', '#7C3AED', '#E5E7EB', '#111111'].map((color, i) => (
            <div key={i} className="flex-1 h-16 rounded-lg shadow-sm" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Thermometer,
    title: "Warm/Cool Palette Generator",
    description: "Instantly generate warm or cool variations of your palette with one click.",
    demo: (
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button className="flex-1 bg-orange-500 hover:bg-orange-600">Generate Warm</Button>
          <Button className="flex-1 bg-blue-500 hover:bg-blue-600">Generate Cool</Button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {['#FF6B6B', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1'].map((color, i) => (
            <div key={i} className="aspect-square rounded-lg shadow-sm" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Waves,
    title: "Gradient Generator",
    description: "Create stunning multi-stop gradients with angle controls and instant CSS export.",
    demo: (
      <div className="space-y-3">
        <div className="h-32 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }} />
        <div className="flex gap-2">
          <input type="range" className="flex-1" defaultValue="135" />
          <Button size="sm">Copy CSS</Button>
        </div>
      </div>
    ),
  },
  {
    icon: Share2,
    title: "Shareable Palette Links",
    description: "Generate unique URLs to share your palettes with clients and team members.",
    demo: (
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <code className="text-sm flex-1 text-muted-foreground">swatchgen.app/p/xyz123</code>
          <Button size="sm" variant="outline">Copy</Button>
        </div>
        <Button className="w-full">Share Palette</Button>
      </div>
    ),
  },
  {
    icon: ImageDown,
    title: "Download as PNG",
    description: "Export professional palette cards with color codes for presentations and mood boards.",
    demo: (
      <div className="glass-card p-6 space-y-4">
        <div className="flex gap-2">
          {['#2563EB', '#7C3AED', '#E5E7EB'].map((color, i) => (
            <div key={i} className="flex-1">
              <div className="h-20 rounded-lg mb-2 shadow-sm" style={{ backgroundColor: color }} />
              <code className="text-xs text-muted-foreground">{color}</code>
            </div>
          ))}
        </div>
        <Button className="w-full">
          <ImageDown className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: "AI Typography Suggestions",
    description: "Get intelligent font pairing recommendations based on your palette's mood and style.",
    demo: (
      <div className="space-y-4">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Recommended Headline</p>
          <p className="text-2xl font-bold">Inter Bold</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Recommended Body</p>
          <p className="text-lg">Inter Regular</p>
        </div>
      </div>
    ),
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful Features for Modern Designers
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, customize, and share stunning color palettes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-auto">{feature.demo}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
