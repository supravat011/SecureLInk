import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
        genAI = new GoogleGenAI({ apiKey });
    } else {
        console.warn("API_KEY not found in environment.");
    }
  }
  return genAI;
};

export const analyzeSecurityContext = async (
  message: string, 
  encrypted: string,
  algorithm: string
): Promise<string> => {
  const ai = getGenAI();
  if (!ai) return "AI Analysis Unavailable: API Key missing.";

  try {
    const prompt = `
      You are a senior cybersecurity analyst. Analyze this secure transmission.
      Algorithm: ${algorithm}
      Original Length: ${message.length} chars
      Encrypted Snippet: ${encrypted.substring(0, 20)}...

      Explain briefly (max 50 words) why this encryption (AES-256-GCM) is considered secure for this message. 
      Mention entropy or confusion/diffusion if relevant.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Analysis complete. Transmission secure.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Analysis failed to connect.";
  }
};

export const explainConcept = async (concept: string): Promise<string> => {
  const ai = getGenAI();
  if (!ai) return "Explanation Unavailable.";

  try {
    const prompt = `Explain the cybersecurity concept "${concept}" in simple terms for a student. Max 3 sentences.`;
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "No explanation available.";
  } catch (e) {
    return "Error fetching explanation.";
  }
};