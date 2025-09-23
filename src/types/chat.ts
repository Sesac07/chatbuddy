export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
}

export type SendMessageFunction = (content: string) => Promise<void>;
