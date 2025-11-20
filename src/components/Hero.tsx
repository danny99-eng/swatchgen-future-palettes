import { Button } from "@/components/ui/button";
import { Upload, Sparkles } from "lucide-react";
import heroMockup from "@/assets/hero-mockup.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Color Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Design Smarter with{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Instant Color Intelligence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              SwatchGen extracts beautiful palettes, generates gradients, recommends typography, 
              and gives designers futuristic tools to work faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                onClick={() => {
                  document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Try SwatchGen
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent hover:scale-105 transition-all duration-300"
                onClick={() => {
                  document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Image
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-3xl font-bold text-foreground">500K+</div>
                <div className="text-sm text-muted-foreground">Palettes Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Designers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">4.9/5</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Mockup */}
          <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <img 
                src={heroMockup} 
                alt="SwatchGen Interface" 
                className="w-full rounded-3xl shadow-2xl hover-lift"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl -z-10 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
