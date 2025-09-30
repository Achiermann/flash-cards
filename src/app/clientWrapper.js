
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../components/sidebar';
import {useState, useEffect} from 'react';
import {AlignJustify} from 'lucide-react';
import LoginPage from './login/page';
import MessageField from '@/components/messageField'; 
import { StyledEngineProvider } from '@mui/material/styles';

export default function ClientWrapper({ children }) {

const pathname = usePathname();
const isHome = pathname === '/';
const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Color theme on route change (your original logic)
  useEffect(() => {
    const colorPairs = [{ primary: '#ffa1ca', secondary: '#ffdbab' }];
    const picked = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    document.documentElement.style.setProperty('--color-primary', picked.primary);
    document.documentElement.style.setProperty('--color-secondary', picked.secondary);
  }, [pathname]);

const [showSidebar, setShowSidebar] = useState(false);


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
    <div className="client-wrapper">
          <StyledEngineProvider injectFirst>
            <MessageField/>
    {!isLoggedIn && <LoginPage/>}
     {showSidebar && <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
      {!showSidebar && pathname === '/' && <div className="burger-grid"><AlignJustify className="burger" onClick={() => setShowSidebar(true)} /></div>}
      <div className="main-content-container">
      {pathname !== '/' && (
    <Link href="/"><button className="go-to-main-button">Go to main</button></Link>
      )}
      {children}
    </div>
    </StyledEngineProvider>
    </div>
  );
}
