'use server';

import { GoogleGenAI } from '@google/genai';
import { ChatState, History, Message } from '../../types/chat';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

// 상담 타입에 따른 시스템 지침 생성
function getSystemInstruction(consultingType: 'T' | 'F'): string {
  if (consultingType === 'T') {
    return `당신은 전문적인 심리 상담사입니다. 다음 규칙을 따라 상담을 진행하세요:
      1. 감정보다는 사실과 논리에 기반하여 분석하세요. 공감은 중요하지 않습니다. 문제상황 분석과 해결책 제시를 우선시하세요.
      2. 상담자에게 잘못된 점은 잘못된 점이 있다고 꼭 말하세요.
      3. 상담 대상자가 실질적인 목표를 설정하고 달성할 수 있도록 도와주세요.
      4. 공감보다는 딱딱하고 사무적인 말투로 대화하세요.
      5. 공감을 우선시 하지말고 잘못된 점이 있다면 사용자가 더 나은 방향으로 나아갈 수 있도록 도와주세요.
      `;
  } else {
    return `당신은 따뜻하고 공감적인 심리 상담사입니다. 다음 규칙을 따라 상담을 진행하세요:
      1. 상대방의 감정을 먼저 이해하고 공감하세요.
      2. 부드럽고 위로가 되는 말투로 대화하세요.
      3. 논리적 해결책보다 상대방의 감정을 먼저 살피고 위로하세요.
      4. 어떤 감정이나 생각도 판단하지 않고 받아들이세요.
      5. 상대방이 자신의 감정을 자유롭게 표현할 수 있도록 격려하세요.
      6. 상담 시 문제 해결보다는 감정적 지지와 공감을 우선시하세요.`;
  }
}

function convertChatStateToHistory(chatState: ChatState): History[] {
  // 초기 인사말 메시지는 제외하고 변환
  const messagesToConvert = chatState.messages.slice(1);

  return messagesToConvert.map((message: Message) => ({
    role: message.sender === 'model' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));
}

export async function sendChatMessage(
  formData: FormData,
  chatState: ChatState,
  consultingType: 'T' | 'F' = 'F',
) {
  const message = formData.get('message') as string;
  if (!message?.trim()) {
    return {
      success: false,
      error: '메시지가 필요합니다.',
    };
  }

  try {
    const history = convertChatStateToHistory(chatState);
    const systemInstruction = getSystemInstruction(consultingType);

    const chatConfig =
      history.length > 0
        ? {
            model: 'gemini-2.5-flash-lite',
            history,
            systemInstruction,
          }
        : {
            model: 'gemini-2.5-flash-lite',
            systemInstruction,
          };

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
