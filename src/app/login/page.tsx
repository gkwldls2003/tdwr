'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const login_id = formData.get('login_id') as string;
    const passwd = formData.get('passwd') as string;

    if(!login_id) {
      alert("아이디를 입력해주세요.")
      return;
    }

    if(!passwd) {
      alert("비밀번호를 입력해주세요.")
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        login_id,
        passwd,
        redirect: false,
      });

      if (result?.error) {
        setError('사용자 인증에 실패 하였습니다. 다시 확인하여 주십시오.');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('오류가 발생하였습니다. 관리자에게 문의하여 주십시요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center">로그인</h1>
        
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <input
            type="text"
            id="login_id"
            name="login_id"
            placeholder="아이디를 입력해주세요."
            className="mt-1 block w-full rounded border p-2"
            autoComplete="username"
          />
        </div>

        <div>
          <input
            type="password"
            id="passwd"
            name="passwd"
            placeholder="비밀번호를 입력해주세요."
            className="mt-1 block w-full rounded border p-2"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {isLoading ? '로그인 중입니다...' : '로그인'}
        </button>
      </form>
    </div>
  );
}