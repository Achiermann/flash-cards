'use client';

import Link from 'next/link';
import {X} from 'lucide-react';
import '@/styles/sidebar.css';

export default function Sidebar({showSidebar, setShowSidebar, isLoggedIn, setIsLoggedIn}) {

  async function handleLogout() {
  await fetch('/api/users/logout', { method: 'POST' });
setIsLoggedIn(false);
  }

  
  return (<div className="sidebar-container">
    <div className="sidebar-title"><h2>Options</h2>
  </div>
  <div className="sb-option-div-container">
{/* Option: Manage All Sets  */}
<Link href={`/`} className="go-to-main-link"><div className="sb-option-div"><button>Main</button></div></Link>
{/* Option: Conjugator  */}
<Link href={`/conjugatorPage`} className="conjugator-page-link"><div className="sb-option-div"><button>Conjugator</button></div></Link>    
{/* Option: Manage All Sets  */}
<Link href={`/manageAllSets`} className="manage-all-link"><div className="sb-option-div"><button>Manage All Sets</button></div></Link>
{/* Option: Log Out  */}
<div className="sb-option-div"><button onClick={handleLogout}>Log Out</button></div>
  </div>
  </div>
  );
}
