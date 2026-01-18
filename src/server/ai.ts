// src/server/ai.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function simplePromptTest(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Backend Error: GEMINI_API_KEY is missing from environment variables."
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("An Error occured while using Gemini: ", error);
  }
}
