// Gemini AI integration temporarily removed for frontend build compatibility.

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export async function generateResponse(messages: ChatMessage[]): Promise<string> {
  return 'Gemini AI chat is coming soon!';
} 