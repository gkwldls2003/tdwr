'use client'

import React from 'react';
import { Provider } from 'react-redux';
import { store } from "../../../store/store";
import LayoutContent from '../layoutContent';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}