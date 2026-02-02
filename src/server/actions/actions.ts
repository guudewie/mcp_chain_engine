"use server";

import { simplePromptTest } from "@/server/ai/ai";
import { getDatabaseInventory } from "../db/discovery";
import { DatabaseInventory } from "@/types/types";

export async function askGemini(prompt: string) {
  try {
    const text = await simplePromptTest(prompt);
    return { text };
  } catch (error) {
    console.error("Backend Error: ", error);
    return { error: "Failed to fetch gemini" };
  }
}

export async function askGeminiRecommendations() {
  const result: DiscoverDbResult = await discoverDb();
  if (result.success) {
    return await askGemini(result.data);
  } else {
    throw new Error(result.error);
  }
}

type DiscoverDbResult =
  | { success: true; data: string }
  | { success: false; error: string };

export async function discoverDb(): Promise<DiscoverDbResult> {
  try {
    const content: DatabaseInventory = await getDatabaseInventory();
    return {
      success: true,
      data: JSON.stringify(content),
    };
  } catch (error) {
    console.error("Backend Error: ", error);
    return {
      success: false,
      error: "Failed to fetch db schema",
    };
  }
}
