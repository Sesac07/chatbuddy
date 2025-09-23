'use client';

import { useState } from 'react';
import { ChatState, Message } from '../../types/chat';
import MessageInput from './message-input';
import MessageList from './message-list';

export default function ChatPage() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: crypto.randomUUID(),
        content: '안녕하세요! 당신의 고민을 들려주세요. 무엇을 도와드릴까요?',
        sender: 'ai',
        timestamp: new Date(),
      },
    ],
    isTyping: false,
    isLoading: false,
  });

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
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

    try {
      // 상담 ai 호출 API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: '답변입니다. ~~~',
        sender: 'ai',
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
        isTyping: false,
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        isTyping: false,
      }));
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col bg-gray-50 lg:max-w-3xl">
      {/* 채팅 메시지 영역 */}
      <MessageList messages={chatState.messages} isTyping={chatState.isTyping} />

      {/* 메시지 입력 영역 */}
      <MessageInput
        onSendMessage={sendMessage}
        isLoading={chatState.isLoading}
        disabled={chatState.isTyping}
      />
    </div>
  );
}
