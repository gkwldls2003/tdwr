import React from 'react';

export default function Header() {

  return (
        <div>
      {/* 헤더 */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        {/* 왼쪽: 로고 및 메뉴 */}
        <div className="flex items-center space-x-6">
          {/* 로고 */}
          <div className="font-bold text-blue-500 text-xl">오늘의 일</div>
          {/* 메인 네비게이션 */}
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-gray-900">지도</a>
          </nav>
        </div>

        {/* 오른쪽: 사용자 메뉴 */}
        <div className="flex items-center space-x-4">
          <button className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">
            로그인
          </button>
          <button className="px-3 py-1.5 text-sm border rounded-md bg-blue-500 text-white hover:bg-blue-600">
            회원가입
          </button>
          <button className="px-3 py-1.5 text-sm border rounded-md text-blue-500 hover:bg-blue-50">
            노무사무실 가입/광고문의
          </button>
        </div>
      </header>
      </div>
  );
}