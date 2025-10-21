export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'model';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatState {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
}

export interface History {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export type SendMessageFunction = (content: string) => Promise<void>;
