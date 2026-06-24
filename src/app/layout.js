import "../styles/main.css";
import '@/styles/manageSet.css';
import '@/styles/setsControl.css';
import '@/styles/setItem.css';

import ClientWrapper from './clientWrapper';
import { Inter, JetBrains_Mono, Nabla } from 'next/font/google';

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

// Body / chrome
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

// Table headers + pills
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

// Wordmark (inflated/rounded display font)
const nabla = Nabla({
  subsets: ['latin'],
  variable: '--font-nabla',
  display: 'swap',
});

export const metadata = {
  title: { default: "Flash Cards", template: "%s | Flash Cards" },
  description: "Study with spaced repetition flash cards",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {

 return (
   <html lang="en">
<body className={`${inter.variable} ${jetBrainsMono.variable} ${nabla.variable}`}>
<ClientWrapper>
  {children}
</ClientWrapper>
      </body>
    </html>
  );
}