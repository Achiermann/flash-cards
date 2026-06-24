
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../components/sidebar';
import {useState, useEffect} from 'react';
import LoginPage from './login/page';
import MessageField from '@/components/messageField';
import { StyledEngineProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import '@/styles/layout.css';

export default function ClientWrapper({ children }) {

const pathname = usePathname();
const isHome = pathname === '/';
const [isLoggedIn, setIsLoggedIn] = useState(true);
const [isMobile, setIsMobile] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);

// Close the mobile drawer whenever the route changes (nav link tapped)
useEffect(() => { setSidebarOpen(false); }, [pathname]);

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

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  handleResize();
  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);

  return (
    <div className="client-wrapper">
          <StyledEngineProvider injectFirst>
            <Toaster toastOptions={{ className: 'toaster' }} />
            <MessageField/>
    {!isLoggedIn && <LoginPage/>}
    {isLoggedIn && (
      <button
        className="burger-grid"
        aria-label="Open menu"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={40} strokeWidth={2.5} />
      </button>
    )}
    <Sidebar
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
    />
      <div className="main-content-container">
    {pathname !== '/' && isMobile && (<Link href="/"><button className="go-to-main-button">Go to main</button></Link>)}
      {children}
    </div>
    </StyledEngineProvider>
    </div>
  );
}
