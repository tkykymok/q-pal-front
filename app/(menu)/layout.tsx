import React, { FC, ReactNode } from 'react';
import '../globals.css';
import MySidebar from '@/components/MySidebar';
import StaffListArea from '@/components/StaffListArea';
import {StaffType} from '@/components/features/DndBoard/DndBoard';

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
