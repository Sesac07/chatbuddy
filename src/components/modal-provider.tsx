'use client';

import { createContext, useContext, useState } from 'react';

interface Modal {
  id: string;
  content: React.ReactNode;
}

interface ModalContextType {
  showModal: (id: string, content: React.ReactNode) => void;
  closeModal: (id?: string) => void;
  modalList: Modal[];
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
  const [modalList, setModalList] = useState<Modal[]>([]);

  const showModal = (id: string, content: React.ReactNode): void => {
    setModalList((prev) => {
      const exists = prev.some((modal) => modal.id === id);
      if (exists) return prev;
      return [...prev, { id, content }];
    });
  };

  const closeModal = (id?: string) => {
    if (id) {
      setModalList((prev) => prev.filter((modal) => modal.id !== id));
    } else {
      setModalList([]);
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal, modalList }}>
      {children}
      {modalList.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          {modalList.map((modal) => (
            <div key={modal.id} onClick={() => closeModal(modal.id)}>
              {modal.content}
            </div>
          ))}
        </div>
      )}
    </ModalContext.Provider>
  );
};
