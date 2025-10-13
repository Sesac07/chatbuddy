'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// 더미 데이터
const consultations = [
  { id: 1, title: '진로 고민', date: '2025-01-10' },
  { id: 2, title: '인간관계 문제', date: '2025-01-09' },
  { id: 3, title: '학업 스트레스', date: '2025-01-08' },
  { id: 4, title: '가족 문제', date: '2025-01-07' },
  { id: 5, title: '취업 고민', date: '2025-01-06' },
];

export default function ConsultSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={cn(
        'absolute top-0 left-0 z-10 flex h-full w-[20%] transform flex-col bg-white transition-transform duration-300',
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
      )}>
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900">상담 솔루션 목록</h2>
      </div>
      {/* 상담 목록 */}
      <div className="flex-1 overflow-y-auto p-2">
        <ul>
          {consultations.map((consult) => (
            <li
              key={consult.id}
              className="mb-2 w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-3 text-left transition-all hover:border-[#a7d8a7] hover:bg-[#a7d8a7]/5 hover:shadow-md">
              <h3 className="truncate font-medium text-gray-900">{consult.title}</h3>
              <p className="mt-2 text-xs text-gray-400">{consult.date}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-gray-200 p-4">
        <button className="w-full rounded-lg bg-[#a7d8a7] px-4 py-2 font-medium text-white transition-colors hover:bg-[#8fbc8f]">
          + 새 상담 시작
        </button>
      </div>
    </div>
  );
}
