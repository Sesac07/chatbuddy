'use client';
import { useModal } from '@/components/modal-provider';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ConsultationItem, deleteConsultation } from './consult-actions';
import SolutionModal from './solution-modal';

type ConsultSidebarProps = {
  consultationList: ConsultationItem[];
  getConsultationList: () => void;
  resetChatState: () => void;
};

export default function ConsultSidebar({
  consultationList,
  getConsultationList,
  resetChatState,
}: ConsultSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { showModal } = useModal();

  const handleDelete = async (e: React.MouseEvent, consultId: string) => {
    e.stopPropagation();

    if (!confirm('이 상담을 삭제하시겠습니까?')) {
      return;
    }

    const result = await deleteConsultation(consultId);

    if (result.success) {
      getConsultationList();
    } else {
      alert(result.error || '삭제에 실패했습니다.');
    }
  };

  const handleSelectChat = (consult: ConsultationItem) => {
    showModal(
      'solution-modal',
      <SolutionModal
        summaryTitle={consult.title}
        summaryContent={consult.solution_summary.summaryContent}
        solution={consult.solution_summary.solution}
      />,
    );
  };

  // 컴포넌트 마운트 시 상담 목록 조회
  useEffect(() => {
    getConsultationList();
  }, []);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-4 left-4 z-20 rounded-md bg-white p-2 text-gray-600 shadow-lg transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="사이드바 열기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {/* 사이드바 */}
      <div
        className={cn(
          'absolute top-0 left-0 z-10 flex h-full w-[20%] transform flex-col bg-white transition-transform duration-300',
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
        )}>
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900">상담 솔루션 목록</h2>
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="사이드바 닫기">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M15 18l-6-6 6-6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        {/* 상담 목록 */}
        <div className="flex-1 overflow-y-auto p-2">
          {consultationList.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500">상담 내역이 없습니다</p>
            </div>
          ) : (
            <ul>
              {consultationList.map((consult) => (
                <li
                  key={consult.id}
                  onClick={() => handleSelectChat(consult)}
                  className="group relative mb-2 w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-[#a7d8a7] hover:bg-[#a7d8a7]/5 hover:shadow-md">
                  <div className="pr-8">
                    <h3 className="truncate font-medium text-gray-900">{consult.title}</h3>
                    <p className="mt-2 text-xs text-gray-400">{consult.date}</p>
                  </div>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => handleDelete(e, consult.id)}
                    className="absolute top-2 right-2 rounded-md p-1 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="상담 삭제">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={resetChatState}
            className="w-full rounded-lg bg-[#a7d8a7] px-4 py-2 font-medium text-white transition-colors hover:bg-[#8fbc8f]">
            + 새 상담 시작
          </button>
        </div>
      </div>
    </>
  );
}
