'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function JoinSelectPage() {
  const router = useRouter();

  const SinglePersonSVG = () => (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      <circle cx="100" cy="60" r="30" fill="#4B5563"/>
      <path d="M100 90 L100 160 M60 120 L140 120 M70 200 L100 160 L130 200" 
        stroke="#4B5563" strokeWidth="12" fill="none" strokeLinecap="round"/>
    </svg>
  );

  const MultiplePeopleSVG = () => (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
    <rect x="40" y="40" width="120" height="160" fill="#4B5563"/>
    <rect x="55" y="60" width="25" height="25" fill="white"/>
    <rect x="87.5" y="60" width="25" height="25" fill="white"/>
    <rect x="120" y="60" width="25" height="25" fill="white"/>
    <rect x="55" y="95" width="25" height="25" fill="white"/>
    <rect x="87.5" y="95" width="25" height="25" fill="white"/>
    <rect x="120" y="95" width="25" height="25" fill="white"/>
    <rect x="55" y="130" width="25" height="25" fill="white"/>
    <rect x="87.5" y="130" width="25" height="25" fill="white"/>
    <rect x="120" y="130" width="25" height="25" fill="white"/>
    <rect x="87.5" y="165" width="25" height="35" fill="white"/>
    <path d="M30 40 L100 10 L170 40" stroke="#4B5563" strokeWidth="10" fill="none"/>
  </svg>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2"></h1>
        <div className="text-3xl font-bold">
          <span className="text-blue-600">오늘의</span>
          <span className="text-orange-500"> 일</span>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Individual Membership Card */}
        <div className="flex-1">
          <div className="h-full bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h2 className="text-xl font-bold mb-2">개인 회원</h2>
            <p className="text-gray-600 mb-4">이력서를 등록하고 일자리를 찾아보세요</p>
            {/* Placeholder for the individual member image */}
            <div className="mb-4">
              <SinglePersonSVG />
            </div>
            <button
              onClick={() => router.push('/join/individual')}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              통합 개인 회원가입
            </button>
          </div>
        </div>

        {/* Business Membership Card */}
        <div className="flex-1">
          <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <h2 className="text-xl font-bold mb-2">기업 회원</h2>
            <p className="text-gray-600 mb-4">공고를 등록하고 인재를 찾아보세요</p>
            {/* Placeholder for the business member image */}
            <div className="mb-4">
              <MultiplePeopleSVG />
            </div>
            <button
              onClick={() => router.push('/join/business')}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              통합 기업 회원가입
            </button>
            <p className="text-gray-500 text-sm mt-4">• 오늘의 일 채용하시는 개인사업자, 사업체직원 포함</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center gap-2 text-gray-600">
        <span>통합 ID 하나로</span>
        <strong className="text-blue-600">오늘의</strong>
        
        <strong className="text-orange-500">일</strong>
        <span>모든 서비스 이용 가능합니다</span>
      </div>
    </div>
  );
}