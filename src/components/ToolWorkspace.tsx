import { useState } from "react";
import { Home, Palette, Waves, Type, Bookmark, Upload, Share2, ImageDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./ImageUpload";
import ColorSwatch from "./ColorSwatch";
import TypographyAnalysis from "./TypographyAnalysis";
import { extractColors, generateWarmPalette, generateCoolPalette, exportPaletteAsPNG, type ColorData } from "@/lib/colorExtraction";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Palette, label: "Palettes", id: "palettes" },
  { icon: Waves, label: "Gradients", id: "gradients" },
  { icon: Type, label: "Typography AI", id: "typography" },
  { icon: Bookmark, label: "Saved", id: "saved" },
];

const ToolWorkspace = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("palettes");
  const [colors, setColors] = useState<ColorData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const checkPaletteLimit = async () => {
    if (!user || !profile) {
      navigate('/auth');
      return false;
    }

    // Admin and premium have unlimited
    if (profile.role === 'admin' || profile.role === 'premium') {
      return true;
    }

    // Free users limited to 3 per day
    if (profile.palettesToday >= 3) {
      setShowUpgradeModal(true);
      return false;
    }

    return true;
  };

  const incrementPaletteCount = async () => {
    if (!user || !profile || profile.role !== 'free') return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ palettes_today: profile.palettesToday + 1 })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
    } catch (error) {
      console.error('Error updating palette count:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    const canProceed = await checkPaletteLimit();
    if (!canProceed) return;

    setIsProcessing(true);
    setUploadedImage(file);
    
    try {
      const extractedColors = await extractColors(file, 5);
      setColors(extractedColors);
      await incrementPaletteCount();
      toast.success(`Extracted ${extractedColors.length} colors!`);
    } catch (error) {
      toast.error('Failed to extract colors');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWarmPalette = async () => {
    if (!profile || (profile.role === 'free')) {
      toast.error('Warm/Cool palette generation is a premium feature');
      setShowUpgradeModal(true);
      return;
    }
    if (colors.length === 0) {
      toast.error('Upload an image first');
      return;
    }
    const warmColors = generateWarmPalette(colors);
    setColors(warmColors);
    toast.success('Generated warm palette!');
  };

  const handleCoolPalette = async () => {
    if (!profile || (profile.role === 'free')) {
      toast.error('Warm/Cool palette generation is a premium feature');
      setShowUpgradeModal(true);
      return;
    }
    if (colors.length === 0) {
      toast.error('Upload an image first');
      return;
    }
    const coolColors = generateCoolPalette(colors);
    setColors(coolColors);
    toast.success('Generated cool palette!');
  };

  const handleExportPNG = () => {
    if (!profile || (profile.role === 'free')) {
      toast.error('PNG export is a premium feature');
      setShowUpgradeModal(true);
      return;
    }
    if (colors.length === 0) {
      toast.error('No palette to export');
      return;
    }
    try {
      exportPaletteAsPNG(colors, `swatchgen-palette-${Date.now()}.png`);
      toast.success('Palette exported!');
    } catch (error) {
      toast.error('Failed to export palette');
      console.error(error);
    }
  };

  const handleShareLink = () => {
    if (colors.length === 0) {
      toast.error('No palette to share');
      return;
    }
    const paletteData = colors.map(c => c.hex.slice(1)).join('-');
    const shareUrl = `${window.location.origin}/palette/${paletteData}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied!');
  };

  return (
    <>
      <AlertDialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade to Premium</AlertDialogTitle>
            <AlertDialogDescription>
              {profile?.role === 'free' && profile.palettesToday >= 3
                ? "You've reached your daily limit of 3 palettes. Upgrade to Premium for unlimited palette generation!"
                : "This is a premium feature. Upgrade to Premium to unlock unlimited palettes, warm/cool generators, PNG exports, and AI typography suggestions."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowUpgradeModal(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <section id="workspace" className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background scroll-mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Interactive Workspace
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the full power of SwatchGen's design tools
            </p>
            {profile && (
              <p className="text-sm text-muted-foreground mt-2">
                {profile.role === 'free' 
                  ? `Free Plan: ${profile.palettesToday}/3 palettes used today`
                  : `${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Plan: Unlimited`}
              </p>
            )}
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
                  </div>

                  {/* Upload Area */}
                  <ImageUpload 
                    onImageUpload={handleImageUpload} 
                    isProcessing={isProcessing}
                  />

                  {/* Color Swatches */}
                  {colors.length > 0 && (
                    <>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {colors.map((color, index) => (
                          <ColorSwatch
                            key={index}
                            hex={color.hex}
                            rgb={color.rgb}
                            name={color.name}
                          />
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4">
                        <Button 
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={handleWarmPalette}
                        >
                          <Waves className="w-4 h-4 mr-2" />
                          Generate Warm Palette
                        </Button>
                        <Button 
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={handleCoolPalette}
                        >
                          <Waves className="w-4 h-4 mr-2" />
                          Generate Cool Palette
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleExportPNG}
                        >
                          <ImageDown className="w-4 h-4 mr-2" />
                          Download PNG
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleShareLink}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Link
                        </Button>
                      </div>
                    </>
                  )}
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
                <TypographyAnalysis />
              )}

              {activeTab === "home" && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <Upload className="w-16 h-16 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">Start Creating</h3>
                    <p className="text-muted-foreground max-w-md">
                      Upload an image to extract colors or explore existing palettes
                    </p>
                    <Button 
                      size="lg" 
                      className="mt-4"
                      onClick={() => setActiveTab("palettes")}
                    >
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
    </>
  );
};

export default ToolWorkspace;
