// src/app/layout.tsx (Updated)

import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
// 🎯 New: Import the AuthProvider
import { AuthProvider } from "./AuthContext"; 

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "UniFind — Cross-Campus Lost & Found",
  description:
    "UniFind connects ATU Galway & University of Galway to reunite people with lost items. Report, find, and claim items fast — with AR and rewards.",
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%234B7C9B'/%3E%3Cpath d='M38 39l8 8' stroke='%23fff' stroke-width='4' stroke-linecap='round'/%3E%3Ccircle cx='28' cy='28' r='12' fill='none' stroke='%23fff' stroke-width='4'/%3E%3Cpath d='M26 20h12l-6 5z' fill='%23fff'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#F8FAFC] text-[#1E293B]">
      <body className={inter.className}>
       
        <AuthProvider>
          {/* Global NavBar on every page */}
          <NavBar />

          {/* Page content */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
