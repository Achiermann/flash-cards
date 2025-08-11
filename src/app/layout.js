'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/main.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ClientWrapper from './clientWrapper';


export default function RootLayout({ children }) {

const pathname = usePathname();
const isHome = pathname === '/';

 return (
    <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
