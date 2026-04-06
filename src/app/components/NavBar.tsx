"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../../ui/Container";
import { useAuth } from "../AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const AuthLinks = () => {
    if (session) {
      return (
        <ul className="flex items-center gap-6 text-slate-700 font-medium -translate-y-6">
          <li>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="rounded-lg bg-red-500 text-white px-4 py-2 font-bold hover:bg-red-600 transition flex items-center justify-center shadow-sm"
            >
              Sign Out
            </button>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="flex items-center gap-6 text-slate-700 font-medium">
          <li>
            <Link
              href="/login"
              className="rounded-lg bg-[#F5B700] px-5 py-2.5 font-bold text-black hover:brightness-105 transition flex items-center justify-center -translate-y-6 shadow-sm"
            >
              Sign in
            </Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <header className="fixed top-1 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-6xl bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        <Container className="h-16 px-8">
          <div className="grid grid-cols-3 items-center h-full w-full">
            
            {/* 1. LEFT NAV - Nudged up slightly with -translate-y-1 */}
            <nav className="hidden md:flex items-center h-full">
              <ul className="flex items-center gap-8 text-slate-700 font-medium -translate-y-6">
                <li>
                  <Link href="/campus/select/lost" className="hover:text-slate-900 transition-colors">
                    Lost items
                  </Link>
                </li>
                <li>
                  <Link href="/report" className="hover:text-slate-900 transition-colors">
                    Report items
                  </Link>
                </li>
                <li>
                  <Link href="/howitworks" className="hover:text-slate-900 transition-colors">
                    How it works
                  </Link>
                </li>
              </ul>
            </nav>

            {/* 2. CENTER LOGO - Remains as is */}
            
<div className="flex justify-center items-center h-full -translate-y-3">
  <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
    <Image
      src="/updatedlogo.png"
      alt="UniFind Logo"
      width={115}
      height={115}
      priority
      className="object-contain"
    />
  </Link>
</div>

            {/* 3. RIGHT NAV - Nudged up slightly with -translate-y-1 */}
            <nav className="hidden md:flex justify-end items-center h-full gap-8">
              <ul className="flex items-center gap-8 text-slate-700 font-medium -translate-y-6">
                <li>
                  <Link href="/rewards" className="hover:text-slate-900 transition-colors">
                    Rewards
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-slate-900 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
              <div className="flex items-center">
                <AuthLinks />
              </div>
            </nav>

            {/* MOBILE TOGGLE */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden justify-self-end flex items-center h-full text-slate-700"
            >
              <span className="text-2xl">{open ? "✕" : "☰"}</span>
            </button>
          </div>
        </Container>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden mt-2 mx-auto max-w-6xl bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-top-4 duration-200">
          <nav>
            <ul className="flex flex-col gap-4 text-slate-700 font-medium text-center">
              <li><Link href="/campus/select/lost" onClick={() => setOpen(false)}>Lost items</Link></li>
              <li><Link href="/report" onClick={() => setOpen(false)}>Report items</Link></li>
              <li><Link href="/howitworks" onClick={() => setOpen(false)}>How it works</Link></li>
              <li><Link href="/rewards" onClick={() => setOpen(false)}>Rewards</Link></li>
              <li><Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
              <li className="pt-2 border-t border-slate-50">
                {session ? (
                  <button onClick={handleSignOut} className="w-full bg-red-500 text-white py-3 rounded-xl font-bold">Sign Out</button>
                ) : (
                  <Link href="/login" onClick={() => setOpen(false)} className="block w-full bg-[#F5B700] py-3 rounded-xl font-bold text-black text-center">Sign in</Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}