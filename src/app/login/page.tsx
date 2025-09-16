import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">로그인</h1>
          <p className="text-gray-600">소셜 계정으로 간편하게 로그인하세요</p>
        </div>

        <div className="space-y-3">
          <LoginForm />
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">간편하고 안전한 로그인</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
