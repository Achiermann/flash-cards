'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/main.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ClientWrapper from './clientWrapper';
import { useEffect, useState } from 'react';
import LoginPage from './login/page';


export default function RootLayout({ children }) {

const pathname = usePathname();
const isHome = pathname === '/';



// .1    COLOR THEME               

useEffect(() => {
  const colorPairs = [
  { primary: '#ffa1ca', secondary: '#ffdbab' },
]

const randomNr = Math.floor(Math.random() * colorPairs.length);

const pickedPrimary = colorPairs[randomNr].primary;
const pickedSecondary = colorPairs[randomNr].secondary;

console.log("Picked colors:", pickedPrimary, pickedSecondary);

document.documentElement.style.setProperty("--color-primary", pickedPrimary);
document.documentElement.style.setProperty("--color-secondary", pickedSecondary);
}, [pathname]);

const [isLoggedIn, setIsLoggedIn] = useState(false);

 return (
   <html lang="en">
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      {!isLoggedIn && <LoginPage />}
      </body>
    </html>
  );
}
