import { Image, Thermometer, Waves, Share2, ImageDown, Sparkles, Minimize2, ArrowRight } from "lucide-react";
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
  {
    icon: Sparkles,
    title: "AI Moodboard Generator",
    description: "Generate complete moodboards with AI-powered images, color palettes, and typography suggestions from text prompts.",
    demo: (
      <div className="space-y-3">
        <div className="glass-card p-4">
          <input
            type="text"
            placeholder="e.g., Minimalist tropical luxury"
            className="w-full p-2 text-sm rounded-lg border border-border bg-background/50"
            disabled
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['#00C9A7', '#845EC2', '#FF6F91', '#FFC75F'].map((color, i) => (
            <div key={i} className="aspect-square rounded-lg shadow-sm" style={{ backgroundColor: color }} />
          ))}
        </div>
        <Button className="w-full bg-gradient-to-r from-primary to-secondary">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Moodboard
        </Button>
      </div>
    ),
  },
  {
    icon: Minimize2,
    title: "Image Resizer & Compressor",
    description: "Upload any image and instantly reduce file size or resize dimensions without losing clarity.",
    demo: (
      <div className="space-y-3">
        <div className="flex gap-2 items-center justify-center h-20 border-2 border-dashed border-border rounded-xl bg-muted/30">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Original: 2.5MB</p>
            <ArrowRight className="w-4 h-4 mx-auto my-1 text-muted-foreground" />
            <p className="text-xs text-green-500 font-bold">Optimized: 450KB</p>
          </div>
        </div>
        <Button className="w-full" asChild>
          <a href="/tools/image-resizer">Open Tool</a>
        </Button>
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
