import { Upload, Palette, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload an Image",
    description: "Drag and drop or click to upload any image from your device",
  },
  {
    icon: Palette,
    title: "Extract & Generate",
    description: "Auto-extract colors and generate warm/cool palettes instantly",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download as PNG, copy CSS, or share via unique links",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to create stunning color palettes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card p-8 hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary/20">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
