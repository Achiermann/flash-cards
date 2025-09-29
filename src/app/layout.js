// app/layout.js  (SERVER — no 'use client')
import '../styles/main.css'; // keep your existing stylesheet

export const metadata = {
  title: { default: "Flash Cards", template: "%s | Flash Cards" },
  description: "Study with spaced repetition flash cards",
  themeColor: "#ffffff",
  manifest: "/manifest.json",
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
