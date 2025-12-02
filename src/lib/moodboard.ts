import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const getGeminiClient = (apiKey?: string) => {
    const key = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    console.log("Gemini Client Init - Key available:", !!key); // Debug log
    if (!key) {
        throw new Error("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file");
    }
    return new GoogleGenerativeAI(key);
};

export interface MoodboardResult {
    images: string[];
    palette: string[];
    fonts: {
        headline: string;
        body: string;
        notes: string;
    };
}

export const generateMoodboard = async (
    prompt: string,
    apiKey?: string
): Promise<MoodboardResult> => {
    const genAI = getGeminiClient(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        // 1. Generate color palette
        const palettePrompt = `You are a color expert. Return ONLY a JSON object with a 'colors' array containing exactly 5 hex color codes that match the mood: "${prompt}". Example: {"colors": ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#33FFF3"]}`;

        const paletteResult = await model.generateContent(palettePrompt);
        const paletteResponse = paletteResult.response;
        const paletteText = paletteResponse.text();

        let palette: string[] = [];
        try {
            // Clean up markdown code blocks if present
            const cleanJson = paletteText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            palette = parsed.colors || parsed.palette || [];
        } catch (e) {
            console.warn("Failed to parse palette JSON, using defaults", e);
        }

        // Default palette if parsing failed
        if (palette.length === 0) {
            palette = ["#2563EB", "#7C3AED", "#E5E7EB", "#111111", "#FF6B6B"];
        }

        // 2. Generate typography suggestions
        const fontPrompt = `You are a typography expert. Return ONLY a JSON object with 'headline', 'body', and 'notes' fields. Use real Google Fonts names. Suggest a pairing for: "${prompt}". Example: {"headline": "Inter", "body": "Inter", "notes": "Clean and modern pairing"}`;

        const fontResult = await model.generateContent(fontPrompt);
        const fontResponse = fontResult.response;
        const fontText = fontResponse.text();

        let fonts = { headline: "Inter", body: "Inter", notes: "Modern and clean" };
        try {
            const cleanJson = fontText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            fonts = {
                headline: parsed.headline || "Inter",
                body: parsed.body || "Inter",
                notes: parsed.notes || "Modern and clean"
            };
        } catch (e) {
            console.warn("Failed to parse fonts JSON, using defaults", e);
        }

        // 3. For images, we'll use Pollinations.ai which generates images from prompts via URL
        // This is free and doesn't require an API key, making it perfect for this use case
        const images = [
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}%20aesthetic%20photography%20high%20quality?width=400&height=400&nologo=true&seed=1`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}%20detail%20shot%20minimalist?width=400&height=400&nologo=true&seed=2`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}%20texture%20pattern?width=400&height=400&nologo=true&seed=3`,
            `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}%20mood%20lighting?width=400&height=400&nologo=true&seed=4`
        ];

        return {
            images,
            palette,
            fonts
        };
    } catch (error) {
        console.error("Error generating moodboard:", error);
        throw error;
    }
};
