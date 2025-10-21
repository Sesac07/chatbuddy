'use client';

import { useModal } from '@/components/modal-provider';
import ReactMarkdown from 'react-markdown';

interface SolutionModalProps {
  summaryTitle: string;
  summaryContent: string;
  solution: string;
}

export default function SolutionModal({
  summaryTitle,
  summaryContent,
  solution,
}: SolutionModalProps) {
  const { closeModal } = useModal();

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative mx-4 my-8 flex h-[85vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
      {/* 헤더 - 고정 */}
      <div className="flex flex-shrink-0 items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{summaryTitle}</h2>
        </div>
        <button
          onClick={() => closeModal()}
          className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 컨텐츠 영역 - 스크롤 가능 */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
        {/* 상담 내용 요약 */}
        <div className="rounded-xl bg-blue-50 p-5">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">📋 상담 내용 요약</h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-6 mb-3 text-xl font-bold text-gray-900">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-5 mb-2 text-lg font-semibold text-gray-800">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-4 mb-2 text-base font-semibold text-gray-700">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-3 leading-relaxed text-gray-700">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-4 list-inside list-disc space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-4 list-inside list-decimal space-y-2">{children}</ol>
                ),
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => <em className="text-gray-800 italic">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="my-4 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 text-gray-700">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-pink-600">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4">{children}</pre>
                ),
              }}>
              {summaryContent}
            </ReactMarkdown>
          </div>
        </div>

        {/* 해결책 */}
        <div className="rounded-xl bg-green-50 p-5">
          <h3 className="mb-3 text-lg font-semibold text-green-900">💡 해결책 및 조언</h3>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="mt-6 mb-3 text-xl font-bold text-gray-900">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-5 mb-2 text-lg font-semibold text-gray-800">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-4 mb-2 text-base font-semibold text-gray-700">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-3 leading-relaxed text-gray-700">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-4 list-inside list-disc space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-4 list-inside list-decimal space-y-2">{children}</ol>
                ),
                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">{children}</strong>
                ),
                em: ({ children }) => <em className="text-gray-800 italic">{children}</em>,
                blockquote: ({ children }) => (
                  <blockquote className="my-4 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 text-gray-700">
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-pink-600">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-100 p-4">{children}</pre>
                ),
              }}>
              {solution}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 - 고정 */}
      <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
        <button
          onClick={() => closeModal()}
          className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow active:scale-95">
          닫기
        </button>
      </div>
    </div>
  );
}
