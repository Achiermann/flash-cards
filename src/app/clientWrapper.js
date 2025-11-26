
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../components/sidebar';
import {useState, useEffect} from 'react';
import {AlignJustify} from 'lucide-react';
import LoginPage from './login/page';
import MessageField from '@/components/messageField';
import { StyledEngineProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { useSetLanguage } from './stores/useSetLanguage';
import '@/styles/layout.css';

export default function ClientWrapper({ children }) {

const pathname = usePathname();
const isHome = pathname === '/';
const [isLoggedIn, setIsLoggedIn] = useState(true);
const [isMobile, setIsMobile] = useState(false);
const { language, setLanguage } = useSetLanguage();

const languageOptions = [
  { value: "französisch", label: "🇫🇷 Französisch" },
  { value: "englisch", label: "🇬🇧 Englisch" },
  { value: "spanisch", label: "🇪🇸 Spanisch" },
  { value: "deutsch", label: "🇩🇪 Deutsch" },
  { value: "italienisch", label: "🇮🇹 Italienisch" },
  { value: "hebräisch", label: "🇮🇱 Hebräisch" },
  { value: "portugiesisch", label: "🇵🇹 Portugiesisch" },
  { value: "arabisch", label: "🇸🇦 Arabisch" },
  { value: "japanisch", label: "🇯🇵 Japanisch" }
];

  // Color theme on route change (your original logic)
  useEffect(() => {
    const colorPairs = [{ primary: '#ffcde2ff', secondary: '#ccd2ffff' }];
    const picked = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    document.documentElement.style.setProperty('--color-primary', picked.primary);
    document.documentElement.style.setProperty('--color-secondary', picked.secondary);
  }, [pathname]);



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
    <Sidebar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
    <select
      className="language-selector"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      {languageOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
      <div className="main-content-container">
    {pathname !== '/' && isMobile && (<Link href="/"><button className="go-to-main-button">Go to main</button></Link>)}
      {children}
    </div>
    </StyledEngineProvider>
    </div>
  );
}
