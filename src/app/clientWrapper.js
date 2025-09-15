'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './sidebar/page';
import {useState} from 'react';
import {AlignJustify} from 'lucide-react';
import LoginPage from './login/page';

export default function ClientWrapper({ children }) {

const pathname = usePathname();

const [showSidebar, setShowSidebar] = useState(false);


  return (
    <div className="client-wrapper">
     {showSidebar && <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar}/>}
      {!showSidebar && <AlignJustify className="burger" onClick={() => setShowSidebar(true)} />}
      <div className="main-content-container">
      {pathname !== '/' && (
    <Link href="/"><button className="go-to-main-button">Go to main</button></Link>
      )}
      {children}
    </div></div>
  );
}


