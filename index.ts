import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Hello via Bun!");

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_STUDIO_API_KEY || "");
const model = genAi.getGenerativeModel({ model: "gemini-3-flash-preview" });

async function main() {
  const result = await model.generateContent("Hello, what is 1 + 1");
  const response = result.response;
  console.log(response.text());
}

await main();
