'use client';
import LoginModal from '@/components/login-modal';
import { useModal } from '@/components/modal-provider';
import { Message } from '@/types/chat';
import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { getSolution } from './solution-actions';
import SolutionModal from './solution-modal';

type MessageInputProps = {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  disabled: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  messages: Message[];
  resetChatState: () => void;
  getConsultationList: () => void;
};

export default function MessageInput({
  onSubmit,
  isLoading = false,
  disabled = false,
  textareaRef,
  messages,
  resetChatState,
  getConsultationList,
}: MessageInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [solutionLoading, setSolutionLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { status } = useSession();
  const { showModal } = useModal();

  const submitSolution = async () => {
    if (status === 'unauthenticated') {
      showModal('login-modal', <LoginModal />);
      return;
    }

    if (!messages.some((message) => message.sender === 'user')) {
      alert('사용자 메시지가 충분하지 않습니다.');
      return;
    }

    try {
      setSolutionLoading(true);
      const result = await getSolution(messages);

      if (result.success && result.data) {
        showModal(
          'solution-modal',
          <SolutionModal
            summaryTitle={result.data.summaryTitle}
            summaryContent={result.data.summaryContent}
            solution={result.data.solution}
          />,
        );
        resetChatState();
        getConsultationList();
      } else {
        alert(result.error || '솔루션 생성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('솔루션 생성 중 오류가 발생했습니다.');
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || disabled) return;

    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
    setInputValue('');

    // 전송 후 텍스트에리어 높이 리셋
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '46px';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';

      // 초기 높이(46px)를 최소값으로 사용
      const newHeight = Math.max(textarea.scrollHeight, 46);
      textarea.style.height = `${Math.min(newHeight, 120)}px`;

      textarea.scrollTop = textarea.scrollHeight;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setTimeout(adjustTextareaHeight, 0);
  };

  return (
    <div className="mb-5 rounded-[20px] bg-white px-4 py-4 shadow-xl">
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-center space-x-3">
        <button
          type="button"
          className="group flex cursor-pointer items-center space-x-2 rounded-xl bg-[#ff9966] px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-[#ff7043] hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={submitSolution}
          disabled={solutionLoading}>
          {solutionLoading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>솔루션받기</span>
        </button>
        <div className="flex flex-1 justify-center">
          <textarea
            ref={textareaRef}
            name="message"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="max-h-[120px] min-h-[20px] w-full resize-none overflow-y-hidden rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
            disabled={isLoading || disabled}
            rows={1}
          />
        </div>
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading || disabled}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#a7d8a7] text-white transition-colors hover:bg-[#8fbc8f] disabled:cursor-not-allowed disabled:bg-gray-300">
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
