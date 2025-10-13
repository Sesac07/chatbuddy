'use client';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { Message } from '../../types/chat';

interface MessageListProps {
  messages: Message[];
  isTyping?: boolean;
}

function Avatar() {
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#a7d8a7] to-[#8bc98b]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>
  );
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가되면 자동으로 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 px-4 py-6">
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="flex max-w-[85%] items-start space-x-3">
              {message.sender === 'model' && <Avatar />}
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'user'
                    ? 'ml-auto bg-[#e8f2ff] text-gray-800'
                    : 'border border-gray-100 bg-white text-gray-800 shadow-sm'
                }`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  <Markdown>{message.content}</Markdown>
                </div>
                <p
                  className={`mt-1 text-xs ${
                    message.sender === 'user' ? 'text-gray-600' : 'text-gray-500'
                  }`}>
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* AI 타이핑 인디케이터 */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] items-start space-x-3">
              <Avatar />
              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-gray-800 shadow-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: '0.1s' }}></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 스크롤 참조점 */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
