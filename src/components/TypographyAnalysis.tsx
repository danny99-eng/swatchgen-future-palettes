import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Download, Copy, Sparkles, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "./ImageUpload";
import { Skeleton } from "@/components/ui/skeleton";

interface TypographyProfile {
  style: string;
  weight: string;
  contrast: string;
  edges: string;
  width: string;
  features: string[];
  caseDominance: string;
  tone: string;
  description: string;
  bestUse: string;
  exactFont?: string;
  confidence?: string;
}

interface FontPairing {
  family: string;
  category: string;
}

interface FontSuggestions {
  primary: FontPairing;
  body: FontPairing;
  accent?: FontPairing;
  heading?: FontPairing;
  display?: FontPairing;
  code?: FontPairing;
}

interface TypographyAnalysisProps {
  onSaveTypography?: (pairings: FontSuggestions) => void;
}

const TypographyAnalysis = ({ onSaveTypography }: TypographyAnalysisProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingFonts, setIsFetchingFonts] = useState(false);
  const [typographyProfile, setTypographyProfile] = useState<TypographyProfile | null>(null);
  const [fontSuggestions, setFontSuggestions] = useState<FontSuggestions | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const checkAnalysisLimit = () => {
    if (!user || !profile) return false;
    
    if (profile.role === 'admin' || profile.role === 'premium') {
      return true;
    }

    if (profile.typographyAnalysesToday >= 2) {
      toast.error('Free users are limited to 2 analyses per day. Upgrade to Premium for unlimited!');
      return false;
    }

    return true;
  };

  const incrementAnalysisCount = async () => {
    if (!user || !profile || profile.role !== 'free') return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ typography_analyses_today: (profile.typographyAnalysesToday || 0) + 1 })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
    } catch (error) {
      console.error('Error updating analysis count:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!checkAnalysisLimit()) return;

    setIsAnalyzing(true);
    setTypographyProfile(null);
    setFontSuggestions(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);

        const { data, error } = await supabase.functions.invoke('analyze-typography', {
          body: { imageData }
        });

        if (error) throw error;

        if (data.error) {
          toast.error(data.error);
          setIsAnalyzing(false);
          return;
        }

        setTypographyProfile(data.analysis);
        await incrementAnalysisCount();
        toast.success('Typography analyzed successfully!');

        // Auto-fetch font suggestions
        await fetchFontSuggestions(data.analysis);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error.message || 'Failed to analyze typography');
      setIsAnalyzing(false);
    }
  };

  const fetchFontSuggestions = async (typographyData: TypographyProfile) => {
    setIsFetchingFonts(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-fonts', {
        body: { 
          typographyProfile: typographyData,
          isPremium: profile?.role === 'premium' || profile?.role === 'admin'
        }
      });

      if (error) throw error;

      setFontSuggestions(data.pairings);
      toast.success('Font suggestions generated!');
    } catch (error: any) {
      console.error('Font suggestion error:', error);
      toast.error('Failed to generate font suggestions');
    } finally {
      setIsFetchingFonts(false);
      setIsAnalyzing(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!typographyProfile || !fontSuggestions) return;

    const data = {
      typographyProfile,
      fontSuggestions,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typography-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded typography profile!');
  };

  const handleCopyToClipboard = () => {
    if (!typographyProfile || !fontSuggestions) return;

    const text = `Typography Profile:
Style: ${typographyProfile.style}
Weight: ${typographyProfile.weight}
Tone: ${typographyProfile.tone}

Recommended Fonts:
Primary: ${fontSuggestions.primary.family}
Body: ${fontSuggestions.body.family}
${fontSuggestions.accent ? `Accent: ${fontSuggestions.accent.family}` : ''}`;

    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const isPremium = profile?.role === 'premium' || profile?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Typography Analysis
          </h3>
          {profile && (
            <p className="text-sm text-muted-foreground mt-1">
              {profile.role === 'free' 
                ? `Free Plan: ${profile.typographyAnalysesToday || 0}/2 analyses used today`
                : 'Unlimited analyses'}
            </p>
          )}
        </div>
      </div>

      <ImageUpload 
        onImageUpload={handleImageUpload} 
        isProcessing={isAnalyzing}
      />

      {(isAnalyzing || isFetchingFonts) && (
        <Card className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        </Card>
      )}

      {typographyProfile && !isAnalyzing && (
        <Card className="p-6 space-y-4 glass-card">
          <h4 className="text-xl font-semibold">Typography Profile</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Style</p>
              <p className="font-medium text-lg">{typographyProfile.style}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Weight</p>
              <p className="font-medium text-lg">{typographyProfile.weight}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tone</p>
              <p className="font-medium text-lg">{typographyProfile.tone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Edges</p>
              <p className="font-medium text-lg">{typographyProfile.edges}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Characteristics</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {typographyProfile.features.map((feature, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-foreground mt-1">{typographyProfile.description}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Best Use</p>
            <p className="text-foreground mt-1">{typographyProfile.bestUse}</p>
          </div>

          {typographyProfile.exactFont && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm font-medium text-primary">Detected Font: {typographyProfile.exactFont}</p>
              {typographyProfile.confidence && (
                <p className="text-xs text-muted-foreground mt-1">
                  Confidence: {typographyProfile.confidence}
                </p>
              )}
            </div>
          )}
        </Card>
      )}

      {fontSuggestions && !isFetchingFonts && (
        <Card className="p-6 space-y-4 glass-card">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">Recommended Google Fonts</h4>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownloadJSON}>
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
              {onSaveTypography && (
                <Button size="sm" variant="outline" onClick={() => onSaveTypography(fontSuggestions)}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FontPreviewCard 
              label="Primary Brand Font" 
              font={fontSuggestions.primary}
            />
            <FontPreviewCard 
              label="Body Text Font" 
              font={fontSuggestions.body}
            />
            
            {isPremium && fontSuggestions.accent && (
              <FontPreviewCard 
                label="Accent Font" 
                font={fontSuggestions.accent}
              />
            )}
            
            {isPremium && fontSuggestions.heading && (
              <FontPreviewCard 
                label="Heading Font" 
                font={fontSuggestions.heading}
              />
            )}
          </div>

          {!isPremium && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                🎨 Upgrade to Premium to unlock 4 more font suggestions including accent, heading, display, and code fonts!
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

const FontPreviewCard = ({ label, font }: { label: string; font: FontPairing }) => {
  const fontFamily = font.family.replace(/\s+/g, '+');
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@400;700&display=swap`;

  return (
    <Card className="p-4">
      <link href={fontUrl} rel="stylesheet" />
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <p 
        className="text-2xl font-bold mb-1"
        style={{ fontFamily: font.family }}
      >
        {font.family}
      </p>
      <p 
        className="text-sm text-muted-foreground"
        style={{ fontFamily: font.family }}
      >
        The quick brown fox jumps over the lazy dog
      </p>
      <p className="text-xs text-muted-foreground mt-2 capitalize">
        Category: {font.category}
      </p>
    </Card>
  );
};

export default TypographyAnalysis;