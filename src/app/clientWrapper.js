'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../components/sidebar';
import {useState} from 'react';
import {AlignJustify} from 'lucide-react';
import LoginPage from './login/page';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientWrapper({ children, isLoggedIn, setIsLoggedIn }) {

const pathname = usePathname();

const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="client-wrapper">
        <Toaster />
     {showSidebar && <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
      {!showSidebar && pathname === '/' && <div className="burger-grid"><AlignJustify className="burger" onClick={() => setShowSidebar(true)} /></div>}
      <div className="main-content-container">
      {pathname !== '/' && (
    <Link href="/"><button className="go-to-main-button">Go to main</button></Link>
      )}
      {children}
    </div></div>
  );
}


