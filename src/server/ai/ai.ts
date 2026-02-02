// src/server/ai.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function simplePromptTest(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "Backend Error: GEMINI_API_KEY is missing from environment variables.",
    );
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: `
        You are an LLm agent helping in creating a visual dashboard. You are given a database schema.
        Your task is to provide recommendations for charts and analysis of the database you are given.

        Give 8 recommendations. Stick to the following formatting per recommendation. Stay concise.

        Explanation: short explanation of proposed analysis
        Tables/Rows: tables and rows needed to perform analysis
        Chart: recommended chart to visualize the analysis
        `,
      },
    });

    return response.text;
  } catch (error) {
    console.error("An Error occured while using Gemini: ", error);
  }
}
