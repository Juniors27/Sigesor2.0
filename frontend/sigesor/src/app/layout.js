import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SIGESOR",
  description: "sistema de Gestión de Fuas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className} >
        {children}
        <Toaster  richColors position="top-right"/>
        </body>
    </html>
  );
}
