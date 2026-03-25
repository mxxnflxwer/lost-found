"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground font-sans antialiased flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {!isAdminPage && <Navbar />}
          <main className="flex-1 bg-background">{children}</main>
          {!isAdminPage && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
}
