// Next.js가 자동으로 사용하며, 동시에 다른 곳에서도 import 가능
export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        {/* 스피너 애니메이션 */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
        <p className="text-lg font-medium text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}
