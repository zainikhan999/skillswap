import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyAphzP-ZWnBV1Iq-oR5weu9FwwguIep4vo",
});

export const suggestBio = async (req, res) => {
  try {
    const { text } = req.body;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You're an auto-complete assistant. Based on the following partial sentence, suggest a short continuation (3–6 words max), without repeating the input. Keep it relevant and concise. Sentence:\n\n"${text}"\n\nSuggestion:`,
    });

    const suggestion =
      geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    res.status(200).json({ suggestion });
  } catch (error) {
    console.error("GenAI API error:", error.message);
    res.status(500).json({ error: "Failed to get suggestion" });
  }
};
