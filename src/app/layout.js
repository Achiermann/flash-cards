import "../styles/main.css";
import ClientWrapper from './clientWrapper';
import toast, { Toaster } from 'react-hot-toast';
import { Racing_Sans_One, Turret_Road, Funnel_Sans, Inter } from 'next/font/google';

const racingSansOne = Racing_Sans_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-racing',
});

const turretRoad = Turret_Road({
  subsets: ['latin'],
  variable: '--font-turret',
  weight: '400',
});

const funnelSans = Funnel_Sans({
  subsets: ['latin'],
  variable: '--font-funnel-sans',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
});

export const metadata = {
  title: { default: "Flash Cards", template: "%s | Flash Cards" },
  description: "Study with spaced repetition flash cards",
  themeColor: "#ffffff",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {

 return (
   <html lang="en">
<body className={`${inter.variable} ${funnelSans.variable} ${racingSansOne.variable} ${turretRoad.variable}`}>
<Toaster toastOptions={{className: 'toaster'}}/>
<ClientWrapper>
  {children}
</ClientWrapper>
      </body>
    </html>
  );
}