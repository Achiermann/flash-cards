'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "../styles/main.css";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import ClientWrapper from './clientWrapper';
import { useEffect, useState } from 'react';
import LoginPage from './login/page';
import toast, { Toaster } from 'react-hot-toast';
import { red } from "@mui/material/colors";


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

document.documentElement.style.setProperty("--color-primary", pickedPrimary);
document.documentElement.style.setProperty("--color-secondary", pickedSecondary);
}, [pathname]);

const [isLoggedIn, setIsLoggedIn] = useState(true);

useEffect(() => {
  fetch('/api/users/me')
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        setIsLoggedIn(true);
      }
      else if(!data.user) {
        setIsLoggedIn(false);
  }})
    .catch(() => setIsLoggedIn(false));
}, []);


 return (
   <html lang="en">
      <body>
<Toaster toastOptions={{className: 'toaster'}}/>
<ClientWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
  {children}
</ClientWrapper>
      {!isLoggedIn && <LoginPage/>}
      </body>
    </html>
  );
}
