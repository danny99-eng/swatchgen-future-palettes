const key = "AIzaSyD_L-7uWfWGbcmo-9hzqCKeXl5gbuKd3Gs";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        if (data.models) {
            const geminiModels = data.models
                .filter(m => m.name.includes("gemini"))
                .map(m => m.name);
            console.log("Gemini Models:", JSON.stringify(geminiModels, null, 2));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
