'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import { ChatState, Message } from '../../types/chat';
import { sendChatMessage } from './chat-actions';
import ConsultSidebar from './consult-sidbar';
import MessageInput from './message-input';
import MessageList from './message-list';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const consultingType = searchParams.get('type') === 'T' ? 'T' : 'F';

  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: crypto.randomUUID(),
        content: '안녕하세요! 당신의 고민을 들려주세요. 무엇을 도와드릴까요?',
        sender: 'model',
        timestamp: new Date(),
      },
    ],
    isTyping: false,
    isLoading: false,
  });
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFormSubmit = async (formData: FormData) => {
    const content = formData.get('message') as string;

    if (!content?.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    // 사용자 메시지 추가
    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      isTyping: true,
    }));

    startTransition(async () => {
      try {
        // Server Action 호출 (상담 타입 전달)
        const result = await sendChatMessage(formData, chatState, consultingType);

        if (!result.success) {
          throw new Error(result.error || 'AI 메시지 처리 실패');
        }

        const aiMessage: Message = {
          id: crypto.randomUUID(),
          content: result.content || '',
          sender: 'model',
          timestamp: new Date(),
        };

        setChatState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          isLoading: false,
          isTyping: false,
        }));

        // 응답 완료 후 포커스 복원
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 100);
      } catch (error) {
        console.error('메세지 에러 :', error);
        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          isTyping: false,
        }));
      }
    });
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl">
          <MessageList messages={chatState.messages} isTyping={chatState.isTyping} />
        </div>
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <MessageInput
          textareaRef={textareaRef}
          onSubmit={handleFormSubmit}
          isLoading={chatState.isLoading || isPending}
          disabled={chatState.isTyping || isPending}
        />
      </div>
      <ConsultSidebar />
    </div>
  );
}
