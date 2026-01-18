"use server";

import { simplePromptTest } from "@/server/ai";

export async function askGemini(prompt: string) {
  try {
    const text = await simplePromptTest(prompt);
    return { text };
  } catch (error) {
    console.error("Backend Error:", error);
    return { error: "Failed to process request" };
  }
}
