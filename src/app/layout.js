import { Geist, Geist_Mono } from "next/font/google";
import "../styles/main.css";
import Link from "next/link";
import ClientWrapper from './clientWrapper';
import LoginPage from './login/page';
import toast, { Toaster } from 'react-hot-toast';
import { red } from "@mui/material/colors";
import MessageField from '@/components/messageField';

export const metadata = {
  title: { default: "Flash Cards", template: "%s | Flash Cards" },
  description: "Study with spaced repetition flash cards",
  themeColor: "#ffffff",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {

 return (
   <html lang="en">
      <body>
<Toaster toastOptions={{className: 'toaster'}}/>
<MessageField/>
<ClientWrapper>
  {children}
</ClientWrapper>
      </body>
    </html>
  );
}