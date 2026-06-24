'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Languages, LibraryBig, Archive, Settings, LogOut, X } from 'lucide-react';
import { useSetLanguage } from '@/app/stores/useSetLanguage';
import '@/styles/sidebar.css';

export default function Sidebar({ isLoggedIn, setIsLoggedIn, open, onClose }) {

  const pathname = usePathname();
  const language = useSetLanguage((state) => state.language);

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST' });
    setIsLoggedIn(false);
    onClose?.();
  }

  return (
    <div className={`sidebar-container${open ? ' open' : ''}`}>
      {/*//.2                 CLOSE (mobile drawer only)                    */}
      <button className="sidebar-close" aria-label="Close menu" onClick={onClose}>
        <X size={24} />
      </button>

      {/*//.2                 WORDMARK                    */}
      <div className="sidebar-title">flashcards</div>
      <div className="sidebar-workspace">{language}</div>

      {/*//.2                 NAV                    */}
      <nav className="sidebar-nav">
        <Link href="/" className="sidebar-nav-link">
          <button className={`sidebar-nav-btn${isActive('/') ? ' active' : ''}`}>
            <LayoutGrid size={20} /> Main
          </button>
        </Link>
        <Link href="/conjugatorPage" className="sidebar-nav-link">
          <button className={`sidebar-nav-btn${isActive('/conjugatorPage') ? ' active' : ''}`}>
            <Languages size={20} /> Conjugator
          </button>
        </Link>
        <Link href="/manageAllSets" className="sidebar-nav-link">
          <button className={`sidebar-nav-btn${isActive('/manageAllSets') ? ' active' : ''}`}>
            <LibraryBig size={20} /> Manage All Sets
          </button>
        </Link>
      </nav>

      {/*//.2                 FOOTER                    */}
      <div className="sidebar-footer">
        <Link href="/archive" className="sidebar-nav-link">
          <button className={`sidebar-nav-btn${isActive('/archive') ? ' active' : ''}`}>
            <Archive size={20} /> Archive
          </button>
        </Link>
        <Link href="/preferences" className="sidebar-nav-link">
          <button className={`sidebar-nav-btn${isActive('/preferences') ? ' active' : ''}`}>
            <Settings size={20} /> Preferences
          </button>
        </Link>
        <button className="sidebar-nav-btn" onClick={handleLogout}>
          <LogOut size={20} /> Log Out
        </button>
      </div>
    </div>
  );
}
