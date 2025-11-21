import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Fonts API key is public and read-only, safe to use in edge functions
const GOOGLE_FONTS_API_KEY = 'AIzaSyDNzGIRKxo_2rg8_kZhkq6E7ELqkPLPK4g';

interface TypographyProfile {
  style: string;
  weight: string;
  contrast: string;
  edges: string;
  width: string;
  features: string[];
  caseDominance: string;
  tone: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { typographyProfile, colorPalette, isPremium } = await req.json();
    
    if (!typographyProfile) {
      return new Response(
        JSON.stringify({ error: 'Typography profile is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching Google Fonts...');

    // Fetch Google Fonts (using public endpoint without API key to avoid rate limits)
    const response = await fetch(
      'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity',
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Fonts API error:', response.status, errorText);
      
      // Use fallback list of popular fonts
      console.log('Using fallback font list');
      const fallbackFonts = getFallbackFonts();
      const matchedFonts = matchFontsToProfile(fallbackFonts, typographyProfile as TypographyProfile);
      
      const fontLimit = isPremium ? 6 : 2;
      const recommendations = matchedFonts.slice(0, fontLimit);

      const pairings = {
        primary: recommendations[0] || { family: 'Inter', category: 'sans-serif' },
        body: recommendations[1] || { family: 'Open Sans', category: 'sans-serif' },
        accent: recommendations[2] || { family: 'Poppins', category: 'sans-serif' },
        heading: recommendations[3] || { family: 'Montserrat', category: 'sans-serif' },
        display: recommendations[4] || { family: 'Playfair Display', category: 'serif' },
        code: recommendations[5] || { family: 'JetBrains Mono', category: 'monospace' }
      };

      const description = generatePairingDescription(typographyProfile as TypographyProfile, pairings);

      return new Response(
        JSON.stringify({
          success: true,
          pairings: isPremium ? pairings : {
            primary: pairings.primary,
            body: pairings.body
          },
          description,
          totalMatches: matchedFonts.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const fonts = data.items;

    console.log(`Retrieved ${fonts.length} fonts from Google Fonts`);

    // Match fonts based on typography profile
    const matchedFonts = matchFontsToProfile(fonts, typographyProfile as TypographyProfile);
    
    // Free users get 2 fonts, premium get full pairing
    const fontLimit = isPremium ? 6 : 2;
    const recommendations = matchedFonts.slice(0, fontLimit);

    const pairings = {
      primary: recommendations[0] || { family: 'Inter', category: 'sans-serif' },
      body: recommendations[1] || { family: 'Open Sans', category: 'sans-serif' },
      accent: recommendations[2] || { family: 'Poppins', category: 'sans-serif' },
      heading: recommendations[3] || { family: 'Montserrat', category: 'sans-serif' },
      display: recommendations[4] || { family: 'Playfair Display', category: 'serif' },
      code: recommendations[5] || { family: 'JetBrains Mono', category: 'monospace' }
    };

    const description = generatePairingDescription(typographyProfile as TypographyProfile, pairings);

    return new Response(
      JSON.stringify({
        success: true,
        pairings: isPremium ? pairings : {
          primary: pairings.primary,
          body: pairings.body
        },
        description,
        totalMatches: matchedFonts.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in suggest-fonts function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function matchFontsToProfile(fonts: any[], profile: TypographyProfile): any[] {
  const categoryMap: Record<string, string> = {
    'Sans-Serif': 'sans-serif',
    'Serif': 'serif',
    'Display': 'display',
    'Script': 'handwriting',
    'Monospace': 'monospace'
  };

  const targetCategory = categoryMap[profile.style] || 'sans-serif';

  // Filter fonts by category
  let filtered = fonts.filter(font => font.category === targetCategory);

  // Apply weight-based filtering for variants
  filtered = filtered.filter(font => {
    const variants = font.variants || [];
    const hasRegular = variants.includes('regular') || variants.includes('400');
    const hasBold = variants.includes('bold') || variants.includes('700');
    
    if (profile.weight.includes('Bold')) {
      return hasBold;
    }
    return hasRegular;
  });

  // Score fonts based on tone and features
  const scored = filtered.map(font => {
    let score = 100;
    const family = font.family.toLowerCase();
    
    // Tone matching
    if (profile.tone === 'Modern') {
      if (family.includes('inter') || family.includes('work') || family.includes('space')) score += 50;
    } else if (profile.tone === 'Classic') {
      if (family.includes('garamond') || family.includes('times') || family.includes('georgia')) score += 50;
    } else if (profile.tone === 'Elegant') {
      if (family.includes('playfair') || family.includes('cormorant') || family.includes('lora')) score += 50;
    } else if (profile.tone === 'Playful') {
      if (family.includes('comic') || family.includes('pacifico') || family.includes('fredoka')) score += 50;
    }

    // Feature matching
    if (profile.features.includes('Geometric')) {
      if (family.includes('montserrat') || family.includes('poppins') || family.includes('raleway')) score += 30;
    }

    // Width matching
    if (profile.width === 'Condensed') {
      if (family.includes('condensed') || family.includes('narrow')) score += 40;
    } else if (profile.width === 'Extended') {
      if (family.includes('extended') || family.includes('expanded')) score += 40;
    }

    // Edge style matching
    if (profile.edges === 'Rounded') {
      if (family.includes('round') || family.includes('soft')) score += 30;
    }

    return { ...font, score };
  });

  // Sort by score and popularity
  scored.sort((a, b) => b.score - a.score);

  return scored;
}

function getFallbackFonts(): any[] {
  // Curated list of popular Google Fonts with their categories
  return [
    { family: 'Inter', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Roboto', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Open Sans', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Montserrat', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Poppins', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Lato', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Raleway', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Work Sans', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Nunito', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'DM Sans', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Space Grotesk', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Quicksand', category: 'sans-serif', variants: ['regular', '700'] },
    { family: 'Playfair Display', category: 'serif', variants: ['regular', '700'] },
    { family: 'Merriweather', category: 'serif', variants: ['regular', '700'] },
    { family: 'Lora', category: 'serif', variants: ['regular', '700'] },
    { family: 'PT Serif', category: 'serif', variants: ['regular', '700'] },
    { family: 'Crimson Text', category: 'serif', variants: ['regular', '700'] },
    { family: 'Cormorant Garamond', category: 'serif', variants: ['regular', '700'] },
    { family: 'Pacifico', category: 'handwriting', variants: ['regular'] },
    { family: 'Dancing Script', category: 'handwriting', variants: ['regular', '700'] },
    { family: 'Caveat', category: 'handwriting', variants: ['regular', '700'] },
    { family: 'JetBrains Mono', category: 'monospace', variants: ['regular', '700'] },
    { family: 'Fira Code', category: 'monospace', variants: ['regular', '700'] },
    { family: 'Source Code Pro', category: 'monospace', variants: ['regular', '700'] },
    { family: 'Bebas Neue', category: 'display', variants: ['regular'] },
    { family: 'Righteous', category: 'display', variants: ['regular'] },
    { family: 'Alfa Slab One', category: 'display', variants: ['regular'] }
  ];
}

function generatePairingDescription(profile: TypographyProfile, pairings: any): string {
  const primaryFont = pairings.primary.family;
  const bodyFont = pairings.body.family;
  
  return `Matches ${profile.tone.toLowerCase()} ${profile.style.toLowerCase()} with ${profile.weight.toLowerCase()} weight. ${primaryFont} for headings pairs beautifully with ${bodyFont} for body text, creating a ${profile.tone.toLowerCase()} and ${profile.edges.toLowerCase()}-edged design.`;
}