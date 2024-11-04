'use client'

import React from 'react';
import { useAppSelector } from '../../../store/hooks';
import { selectVisibleMarkers } from '../../../store/markerSlice';

export default function LeftSider() {
  const visibleMarkers = useAppSelector(selectVisibleMarkers);

  return (
    <>
        {/* 왼쪽 사이드바 */}
        <div className="w-[400px] flex flex-col border-r">
          {/* 상단 필터 영역 */}
          <div className="p-4 border-b">
            <div className="flex space-x-2 mb-4">
              <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
                일용, 주용
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
                신호수
              </button>
              <button className="px-4 py-2 bg-gray-100 rounded-full text-sm hover:bg-gray-200">
                추가필터
              </button>
            </div>
          </div>

          {/* 매물 리스트 영역 */}
          <div className="flex-1 overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b">
              <div className="text-sm text-gray-600">
                지역 일거리 {visibleMarkers.length}개
              </div>
            </div>
            
            {/* 매물 아이템들 */}
            <div className="divide-y">
              {visibleMarkers.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  {/* <div className="aspect-video bg-gray-200 rounded-lg mb-3"></div> */}
                  <div className="space-y-2">
                    <div className="font-bold">일당 : {item.price}</div>
                    <div className="text-sm text-gray-600">
                      하는일 : {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </>
  );
}