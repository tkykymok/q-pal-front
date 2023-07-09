import React, {ReactNode} from 'react';
import "./globals.css";
import MySidebar from '@/components/MySidebar';
import "reflect-metadata"
import {registerInjections} from '@/config/di';


export const metadata = {
  title: 'QMate',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
    <body className="">
    {/*<Header />*/}
    <div className="flex h-100 min-h-24 h-screen">
      <MySidebar/>
      {children}
    </div>
    </body>
    </html>
  );
}
