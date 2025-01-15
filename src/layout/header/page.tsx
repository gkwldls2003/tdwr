'use client'

import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { insertLogoutHistQuery } from '../../../common/querys/auth/page';

export default function Header() {

  const router = useRouter();
  const { data: session, status } = useSession();
  const userInfo = session?.user.info;

  let user;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })

      if(userInfo) {
        const ipRes = await fetch(`/api/auth/reqUrl`);
        const data = await ipRes.json();

        //로그아웃 이력 저장
        const params = [userInfo.user_id, data.ip, '02']
  
        await insertLogoutHistQuery(params);
      }
     
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('로그아웃 중 에러 발생:', error)
    }
  }

 
  if (status === 'loading') {
    user = '로딩 중입니다...';
  } else if (session) {
    user = <>
      <span>{userInfo?.user_nm}님</span>
      <button 
        onClick={handleLogout} 
        className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
        >
          로그아웃
      </button>
    </>
  } else {
    user = <>
      <Link 
        href={`/login`}
        className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
        >
          로그인
      </Link>
      <Link href={`/join`}
      className="px-3 py-1.5 text-sm border rounded-md bg-blue-500 text-white hover:bg-blue-600"
      >
        회원가입
      </Link>
    </>
  }

  return (
    <div className='bg-white'>
      {/* 헤더 */}
      <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        {/* 왼쪽: 로고 및 메뉴 */}
        <div className="flex items-center space-x-6">
          {/* 로고 */}
          <div className="font-bold text-blue-500 text-xl">
            <Link href={`/`}>오늘의 일</Link>
          </div>
          {/* 메인 네비게이션 */}
          <nav className="flex items-center space-x-6">
            <a href={`/`} className="text-gray-700 hover:text-gray-900">지도</a>
          </nav>
        </div>

        {/* 오른쪽: 사용자 메뉴 */}
        <div className="flex items-center space-x-4">
          <Link href={`/board/free`}>자유게시판</Link>
          <div>{user}</div>
          <button className="px-3 py-1.5 text-sm border rounded-md text-blue-500 hover:bg-blue-50">
            노무사무실 가입/광고문의
          </button>
        </div>
      </header>
    </div>
  );
}