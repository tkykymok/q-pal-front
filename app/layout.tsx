import React, { FC, ReactNode } from 'react';
import './globals.css';
import MySidebar from '@/components/MySidebar';

export const metadata = {
  title: 'QPal',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex h-100 min-h-24 h-screen">
          {children}
      </body>
    </html>
  );
};

export default RootLayout;
