import { CONFIG } from './config.js';

// API Helper Functions
export class APIManager {
    constructor() {
        this.apiKey = this.getApiKey();
    }

    getApiKey() {
        const userKey = localStorage.getItem('gemini_user_api_key');
        if (userKey) return userKey;
        return CONFIG.defaultApiKey;
    }

    saveApiKey(key) {
        localStorage.setItem('gemini_user_api_key', key);
        this.apiKey = key;
    }

    async fetchRecommendations(currentType, genre, exclusionList) {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${this.apiKey}`;
        
        const systemPrompt = "You are an expert entertainment curator. Return a raw JSON array of 5 top-rated recommendations based on the user's request. The JSON must follow this schema: [{ \"title\": \"string\", \"imdbRating\": \"string\", \"suggestion\": \"string\", \"platforms\": [\"string\"] }]. 'platforms' should be a list of major streaming services (e.g., Netflix, Crunchyroll, Disney+, HBO, YouTube). Do not include markdown formatting like ```json. just raw json.";
        
        let userQuery = "";
        const exclusion = exclusionList.length > 0 ? ` (EXCLUDE: ${exclusionList.join(', ')})` : '';
        
        if (!genre || genre === "Surprise Me") {
             userQuery = `Suggest 5 universally top-rated, critically acclaimed ${currentType} from various genres. Do not limit to a single genre.${exclusion} Include IMDb ratings and available streaming platforms.`;
        } else {
             userQuery = `Suggest 5 top-rated ${currentType} for genre '${genre}'.${exclusion} Include IMDb ratings and available streaming platforms.`;
        }

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            tools: [{ "google_search": {} }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                throw new Error('AUTH_ERROR');
            }
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            let rawText = candidate.content.parts[0].text;
            rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const recommendations = JSON.parse(rawText);
            
            let sources = [];
            if (candidate.groundingMetadata?.groundingAttributions) {
                sources = candidate.groundingMetadata.groundingAttributions
                    .map(a => ({ uri: a.web?.uri, title: a.web?.title }))
                    .filter(s => s.uri && s.title);
            }
            
            return { recommendations, sources };
        } else {
            throw new Error('No results found');
        }
    }
}
