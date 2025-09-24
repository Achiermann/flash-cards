// app/layout.js  (SERVER — no 'use client')
import '../styles/main.css'; // keep your existing stylesheet

export const metadata = {
  title: 'Flash Cards',
  description: 'Study flashcards offline with spaced repetition.',
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  appleWebApp: { capable: true, title: 'Flash Cards', statusBarStyle: 'black-translucent' },
  viewport: { width: 'device-width', initialScale: 1, viewportFit: 'cover' },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/icon-192.png' }],
  },
};

import ClientApp from './ClientApp'; // <— new client wrapper we control

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientApp>{children}</ClientApp>
      </body>
    </html>
  );
}
