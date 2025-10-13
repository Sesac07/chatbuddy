'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';

interface ModalContextType {
  openModal: () => void;
  closeModal: () => void;
  isOpen: boolean;
}

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('모달 컨텍스트를 사용할 수 없습니다.');
  }
  return context;
};

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleLogin = () => {
    closeModal();
    router.push('/login');
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeModal}>
          <div
            className="flex min-w-[320px] flex-col gap-6 rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            {/* 아이콘 */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#a7d8a7]/20">
              <svg
                className="h-8 w-8 text-[#8fbc8f]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* 메시지 */}
            <div className="text-center">
              <h3 className="mb-2 text-xl font-bold text-gray-900">로그인 후 사용가능합니다</h3>
            </div>

            {/* 버튼 */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogin}
                className="w-full rounded-lg bg-[#a7d8a7] px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-[#8fbc8f] hover:shadow-lg active:scale-[0.98]">
                로그인하러 가기
              </button>
              <button
                onClick={closeModal}
                className="w-full rounded-lg border-2 border-[#a7d8a7] px-6 py-3 font-medium text-[#8fbc8f] transition-all hover:bg-[#a7d8a7]/10 active:scale-[0.98]">
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
