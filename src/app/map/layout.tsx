import React from 'react';
import Header from '@/layout/header/page';
import Footer from '@/layout/footer/page';
import LeftSider from '@/layout/sider/page';

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex flex-col h-screen w-full">
      <Header/>
      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 사이드바 */}
        <LeftSider/>
        {/* 오른쪽 지도 영역 */}
        <div className="flex-1 relative">
          {children}
        </div>
      </div>
      <Footer/>
    </div>
  );
}