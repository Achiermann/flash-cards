
'use client';

import { usePathname } from 'next/navigation';
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
const [isLoggedIn, setIsLoggedIn] = useState(true);
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
      {children}
    </div>
    </StyledEngineProvider>
    </div>
  );
}
