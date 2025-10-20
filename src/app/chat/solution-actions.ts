'use server';

import { auth } from '@/lib/auth';
import { ai } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rate-limiter';
import { Message } from '@/types/chat';

// 구조화된 출력을 위한 타입 정의
export interface ConsultationSummary {
  summaryTitle: string;
  summaryContent: string;
  solution: string;
}

export async function getSolution(messages: Message[]) {
  // 인증 체크
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: '로그인이 필요합니다.',
    };
  }

  // 분당 3회
  const rateCheck = checkRateLimit(session.user.id, 3);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `요청 한도를 초과했습니다. ${rateCheck.retryAfter}초 후 다시 시도하세요.`,
    };
  }

  try {
    const conversation = messages.slice(1).map((message: Message) => ({
      role: message.sender === 'model' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

    const prompt = `
    다음은 심리 상담 대화 내용입니다. 이 대화를 분석하여 다음 형식으로 답변해주세요:
      1. summaryTitle: 지금까지의 문제상황을 한 문장으로 요약한 간단한 제목을 작성하세요.
      2. summaryContent: 대화 내용을 기반으로 상담 내용을 상세하게 요약하세요.
         - 사용자가 겪고 있는 주요 문제점들
         - 대화에서 나타난 감정 상태와 상황
         - 핵심 고민사항과 배경
         - 마크다운 형식으로 작성하여 가독성을 높이세요.
      3. solution: 대화 내용을 기반으로 구체적인 해결책을 마크다운 형식으로 작성하세요.
         - 마크다운 형식을 사용하여 섹션, 리스트, 강조 등을 활용하세요.
         - 실용적이고 구체적인 조언을 제공하세요.
    `;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      history: conversation,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            summaryTitle: {
              type: 'string',
              description: '상담 내용을 한 문장으로 요약한 간단한 제목',
            },
            summaryContent: {
              type: 'string',
              description: '대화 내용을 기반으로 한 상세한 요약 (마크다운 형식)',
            },
            solution: {
              type: 'string',
              description: '마크다운 형식의 해결책 및 조언',
            },
          },
          required: ['summaryTitle', 'summaryContent', 'solution'],
        },
      },
    });

    const response = await chat.sendMessage({ message: prompt });

    // JSON 파싱하여 타입 안전하게 반환
    const parsedResponse: ConsultationSummary = JSON.parse(response.text || '{}');

    const userId = BigInt(session.user.id);

    // DB에 상담 데이터 저장 (메시지 포함)
    const consultation = await prisma.consultations.create({
      data: {
        user_id: userId,
        title: parsedResponse.summaryTitle,
        solution_summary: {
          summaryContent: parsedResponse.summaryContent,
          solution: parsedResponse.solution,
        },
        messages: messages.slice(1).map((message) => ({
          id: message.id,
          sender: message.sender,
          content: message.content,
          timestamp: new Date().toISOString(),
        })),
        status: 'completed',
        completed_at: new Date(),
      },
    });

    return {
      success: true,
      data: parsedResponse,
      id: consultation.consultation_id.toString(),
      date: consultation.created_at?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Solution generation error:', error);
    return {
      success: false,
      error: '솔루션 생성 중 오류가 발생했습니다.',
    };
  }
}
