import OpenAI from 'openai';
import { config } from 'dotenv';

//const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
//const OPENAI_API_KEY = "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";

config();
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key is required. Please add VITE_OPENAI_API_KEY to your .env file.');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});