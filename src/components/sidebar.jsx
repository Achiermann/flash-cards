'use client';

import Link from 'next/link';
import {X} from 'lucide-react';
import '@/styles/sidebar.css';

export default function Sidebar({showSidebar, setShowSidebar, isLoggedIn, setIsLoggedIn}) {

  async function handleLogout() {
  await fetch('/api/users/logout', { method: 'POST' });
setShowSidebar(false);
setIsLoggedIn(false);
  }

  
  return (<div className="sidebar-container">
    <div className="sidebar-title"><h2>Options</h2>
    <X className="btn-close-sidebar" onClick={() => setShowSidebar(false) }/></div>
  <div className="sb-option-div-container">
<Link href={`/manageAllSets`} className="manage-all-link"><div className="sb-option-div"><button onClick={() => setShowSidebar(false) }>Manage All Sets</button></div></Link>
<Link href={`/archive`} className="archive-link"><div className="sb-option-div"><button onClick={() => setShowSidebar(false) }>Words Archive</button></div></Link>    
<div className="sb-option-div"><button onClick={handleLogout}>Log Out</button></div>
  </div>
  </div>
  );
}
