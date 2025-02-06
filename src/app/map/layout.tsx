'use client'

import React from 'react';
import LeftSider from '@/layout/sider/page';
import { Provider } from 'react-redux';
import { store } from "../../../store/store";
import { useSelector } from 'react-redux';
import { selectShowLeftSider } from '../../../store/layoutSlice';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const showLeftSider = useSelector(selectShowLeftSider);

  return (
    <div className="flex flex-col h-screen w-full">     
      <div className="flex flex-1 overflow-hidden">
        {showLeftSider && <LeftSider/>}
        <div className="flex-1 relative">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LayoutContent>{children}</LayoutContent>
    </Provider>
  );
}