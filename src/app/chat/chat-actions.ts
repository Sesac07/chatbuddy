'use server';

import { GoogleGenAI } from '@google/genai';
import { ChatState, History, Message } from '../../types/chat';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function convertChatStateToHistory(chatState: ChatState): History[] {
  // 초기 ai 메시지는 제외하고 변환
  const messagesToConvert = chatState.messages.slice(1);

  return messagesToConvert.map((message: Message) => ({
    role: message.sender === 'model' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
}

export async function sendChatMessage(formData: FormData, chatState: ChatState) {
  const message = formData.get('message') as string;
  if (!message?.trim()) {
    return {
      success: false,
      error: '메시지가 필요합니다.',
    };
  }

  try {
    const history = convertChatStateToHistory(chatState);
    const chatConfig =
      history.length > 0
        ? { model: 'gemini-2.5-flash-lite', history }
        : { model: 'gemini-2.5-flash-lite' };

    const chat = ai.chats.create(chatConfig);

    const response = await chat.sendMessage({
      message: message.trim(),
    });

    return {
      success: true,
      content: response.text || '',
    };
  } catch (error) {
    console.error('Chat action error:', error);
    return {
      success: false,
      error: '메시지 처리 중 오류가 발생했습니다.',
    };
  }
}
