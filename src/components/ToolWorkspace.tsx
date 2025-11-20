import { useState } from "react";
import { Home, Palette, Waves, Type, Bookmark, Upload, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Palette, label: "Palettes", id: "palettes" },
  { icon: Waves, label: "Gradients", id: "gradients" },
  { icon: Type, label: "Typography AI", id: "typography" },
  { icon: Bookmark, label: "Saved", id: "saved" },
];

const samplePalette = [
  { hex: "#2563EB", rgb: "37, 99, 235", name: "Electric Blue" },
  { hex: "#7C3AED", rgb: "124, 58, 237", name: "Soft Purple" },
  { hex: "#E5E7EB", rgb: "229, 231, 235", name: "Cool Gray" },
  { hex: "#111111", rgb: "17, 17, 17", name: "Deep Black" },
];

const ToolWorkspace = () => {
  const [activeTab, setActiveTab] = useState("palettes");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive Workspace
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the full power of SwatchGen's design tools
          </p>
        </div>

        <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Sidebar */}
            <div className="lg:w-64 border-b lg:border-r border-border/50 p-4 bg-white/50">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {activeTab === "palettes" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">Color Palette</h3>
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>

                  {/* Color Swatches */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {samplePalette.map((color, index) => (
                      <div
                        key={index}
                        className="glass-card p-4 space-y-3 hover-lift"
                      >
                        <div
                          className="h-32 rounded-xl shadow-md"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="space-y-2">
                          <p className="font-semibold text-sm">{color.name}</p>
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-muted-foreground">
                              {color.hex}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(color.hex, index)}
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            RGB: {color.rgb}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Generate Warm Palette
                    </Button>
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      Generate Cool Palette
                    </Button>
                    <Button variant="outline">Download PNG</Button>
                    <Button variant="outline">Share Link</Button>
                  </div>
                </div>
              )}

              {activeTab === "gradients" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">Gradient Generator</h3>
                  <div className="space-y-4">
                    <div
                      className="h-64 rounded-2xl shadow-xl"
                      style={{
                        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
                      }}
                    />
                    <div className="flex gap-3">
                      <Button className="flex-1">Copy CSS</Button>
                      <Button variant="outline">Customize</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "typography" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">AI Typography Suggestions</h3>
                  <div className="space-y-4">
                    <div className="glass-card p-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        Recommended Headline Font
                      </p>
                      <p className="text-4xl font-bold">Inter Bold</p>
                    </div>
                    <div className="glass-card p-6">
                      <p className="text-sm text-muted-foreground mb-2">
                        Recommended Body Font
                      </p>
                      <p className="text-xl">Inter Regular</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "home" && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">Start Creating</h3>
                    <p className="text-muted-foreground max-w-md">
                      Upload an image to extract colors or explore existing palettes
                    </p>
                    <Button size="lg" className="mt-4">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <Bookmark className="w-16 h-16 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">No Saved Palettes</h3>
                    <p className="text-muted-foreground max-w-md">
                      Save your favorite palettes to access them quickly
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolWorkspace;
