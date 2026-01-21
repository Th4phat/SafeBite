import { GoogleGenAI } from '@google/genai';

if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error("No api key")
}
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY

const genAI = new GoogleGenAI({ apiKey: API_KEY });

export const ai = genAI.models;