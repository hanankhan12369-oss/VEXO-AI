export type Role = 'user' | 'model';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

export interface QuickPrompt {
  label: string;
  category: 'Roman Urdu' | 'Coding' | 'Science' | 'Logic' | 'General';
  query: string;
}
