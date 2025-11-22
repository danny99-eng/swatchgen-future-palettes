import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Analyzing typography with Gemini...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a typography analysis expert. Analyze the image and identify font characteristics.
            
Try to identify the EXACT font if possible. If you can confidently recognize a specific font (like Helvetica, Arial, Times New Roman, Garamond, Futura, etc.), include it in the exactFont field with your confidence level.

Analyze and provide:
1. Font Style Category: Serif / Sans-Serif / Display / Script / Monospace
2. Weight: Thin / Light / Regular / Medium / Semi-Bold / Bold / Extra-Bold / Black
3. Contrast Level: Low / Medium / High
4. Edge Style: Sharp / Rounded / Mixed
5. Character Width: Condensed / Normal / Extended
6. Special Features: Geometric / Humanist / Flares / Curls / Decorative elements
7. Case Dominance: Uppercase / Lowercase / Mixed
8. Overall Tone: Modern / Classic / Elegant / Playful / Professional / Artistic
9. Exact Font (if recognizable): The specific font name if you can identify it
10. Confidence: Your confidence level in font identification (high/medium/low)

Return your analysis as a JSON object with these exact fields:
{
  "style": "Sans-Serif",
  "weight": "Semi-Bold",
  "contrast": "Low",
  "edges": "Rounded",
  "width": "Normal",
  "features": ["Geometric", "Clean"],
  "caseDominance": "Mixed",
  "tone": "Modern",
  "description": "Brief 1-2 sentence description of the typography",
  "bestUse": "Recommended use cases (e.g., Branding, UI, Body text)",
  "exactFont": "Font name if identifiable, or your best guess",
  "confidence": "high/medium/low"
}`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze the typography characteristics in this image. Focus on font style attributes, NOT specific commercial font names.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'analyze_typography',
              description: 'Return typography characteristics analysis',
              parameters: {
                type: 'object',
                properties: {
                  style: { 
                    type: 'string',
                    enum: ['Serif', 'Sans-Serif', 'Display', 'Script', 'Monospace']
                  },
                  weight: {
                    type: 'string',
                    enum: ['Thin', 'Light', 'Regular', 'Medium', 'Semi-Bold', 'Bold', 'Extra-Bold', 'Black']
                  },
                  contrast: {
                    type: 'string',
                    enum: ['Low', 'Medium', 'High']
                  },
                  edges: {
                    type: 'string',
                    enum: ['Sharp', 'Rounded', 'Mixed']
                  },
                  width: {
                    type: 'string',
                    enum: ['Condensed', 'Normal', 'Extended']
                  },
                  features: {
                    type: 'array',
                    items: { type: 'string' }
                  },
                  caseDominance: {
                    type: 'string',
                    enum: ['Uppercase', 'Lowercase', 'Mixed']
                  },
                  tone: {
                    type: 'string',
                    enum: ['Modern', 'Classic', 'Elegant', 'Playful', 'Professional', 'Artistic']
                  },
                  description: { type: 'string' },
                  bestUse: { type: 'string' },
                  exactFont: { type: 'string' },
                  confidence: {
                    type: 'string',
                    enum: ['high', 'medium', 'low']
                  }
                },
                required: ['style', 'weight', 'contrast', 'edges', 'width', 'features', 'caseDominance', 'tone', 'description', 'bestUse', 'confidence'],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'analyze_typography' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI analysis failed', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response');
      return new Response(
        JSON.stringify({ error: 'Invalid AI response format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const typographyProfile = JSON.parse(toolCall.function.arguments);
    
    console.log('Typography analysis completed:', typographyProfile);

    return new Response(
      JSON.stringify({ 
        success: true,
        analysis: typographyProfile
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-typography function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});