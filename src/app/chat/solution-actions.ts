'use server';

import { ai } from '@/lib/gemini';
import { Message } from '@/types/chat';

export async function getSolution(messages: Message[]) {
  try {
    const conversation = messages.slice(1).map((message: Message) => ({
      role: message.sender === 'model' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

    const prompt = `
    다음은 심리 상담 대화 내용입니다. 이 대화를 분석하여 다음 형식으로 답변해주세요:
      1. 지금까지의 문제상황,내용을 요약하세요.
      2. 대화 내용을 해결책을 제시하세요.
      3. 답변 형식은 마크다운 형식으로 내용요약, 해결책을 구분하여 작성하세요.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      history: conversation,
    });

    const response = await chat.sendMessage({ message: prompt });

    return {
      success: true,
      content: response.text || '',
    };
  } catch (error) {
    console.error('Solution generation error:', error);
    return {
      success: false,
      error: '솔루션 생성 중 오류가 발생했습니다.',
    };
  }
}
