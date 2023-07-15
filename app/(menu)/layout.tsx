import React, { FC, ReactNode } from 'react';
import '../globals.css';
import MySidebar from '@/components/MySidebar';

interface RootLayoutProps {
  children: ReactNode;
}

const MenuLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <MySidebar />
      {children}
    </>
  );
};

export default MenuLayout;
