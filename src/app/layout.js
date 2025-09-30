import { Geist, Geist_Mono } from "next/font/google";
import "../styles/main.css";
import ClientWrapper from './clientWrapper';
import toast, { Toaster } from 'react-hot-toast';


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
<ClientWrapper>
  {children}
</ClientWrapper>
      </body>
    </html>
  );
}