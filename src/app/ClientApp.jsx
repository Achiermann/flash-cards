'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

// Keep your own components and paths exactly as you had them
import LoginPage from './login/page';
import MessageField from '@/components/messageField'; // if this alias doesn't exist, swap to a relative path

export default function ClientApp({ children }) {
  const pathname = usePathname();

  // Color theme on route change (your original logic)
  useEffect(() => {
    const colorPairs = [{ primary: '#ffa1ca', secondary: '#ffdbab' }];
    const picked = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    document.documentElement.style.setProperty('--color-primary', picked.primary);
    document.documentElement.style.setProperty('--color-secondary', picked.secondary);
  }, [pathname]);

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    fetch('/api/users/me')
      .then(res => res.json())
      .then(data => setIsLoggedIn(!!data.user))
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <>
      <Toaster toastOptions={{ className: 'toaster' }} />
      <MessageField />
      {/* Render app content */}
      {children}
      {/* Overlay/login fallback when not logged in */}
      {!isLoggedIn && <LoginPage />}
    </>
  );
}
