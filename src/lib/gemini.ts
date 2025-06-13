import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API with your API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log('API Key available:', !!apiKey); // This will log true/false without exposing the key

if (!apiKey) {
  console.error('Gemini API key is missing. Please check your .env file.');
}

const genAI = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: { apiVersion: "v1alpha" },
});

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export async function generateResponse(messages: ChatMessage[]): Promise<string> {
  try {
    if (!apiKey) {
      throw new Error('API key is missing');
    }

    console.log('Attempting to generate response...');
    
    // Get the last user message
    const lastUserMessage = messages[messages.length - 1].parts;
    console.log('Sending message to Gemini:', lastUserMessage);

    // Generate response using the new API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(lastUserMessage);
    const response = await result.response;
    console.log('Received response from Gemini');
    
    return response.text();
  } catch (error) {
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Error: Invalid API key. Please check your Gemini API key.';
      }
      return `Error: ${error.message}. Please try again.`;
    }
    return 'I apologize, but I encountered an error while processing your request. Please try again.';
  }
} 