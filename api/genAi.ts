import { GoogleGenAI } from '@google/genai';

// Access your API key (see "Set up your API key" above)
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDUTSNMnzFHwpgtktOSPdt055EJ9GOWYN0'

// Initialize the Google Generative AI client
const genAI = new GoogleGenAI({apiKey: API_KEY});

// For text-only input, use the gemini-pro model
export const ai = genAI.models;