'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function ClientWrapper({ children }) {
  const pathname = usePathname();

  return (
    <>
      {pathname !== '/' && (
    <Link href="/"><button className="go-to-main-button">Go to main</button></Link>
      )}
      {children}
    </>
  );
}


