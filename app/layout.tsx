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
      <body className="flex h-full bg-bg-light">
          {children}
      </body>
    </html>
  );
};

export default RootLayout;
