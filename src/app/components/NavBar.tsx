// src/app/components/NavBar.tsx
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
        <ul className="flex items-center gap-6 text-slate-700 font-medium">
          <li>
            <Link
              href="/dashboard"
              className="hover:text-slate-900 transition-colors"
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="rounded-lg bg-red-500 text-white px-4 py-2 font-bold hover:bg-red-600 transition"
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
              className="rounded-lg bg-[#F5B700] px-4 py-2 font-bold text-black hover:brightness-105 transition"
            >
              Sign in
            </Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200">
      <Container className="h-16 grid grid-cols-3 items-center">
        
        {/* LEFT NAV (DESKTOP) */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-slate-700 font-medium">
            <li>
              <Link
                href="/campus/select/lost"
                className="hover:text-slate-900 transition-colors"
              >
                Lost items
              </Link>
            </li>

            {/* ✔ UPDATED: Report items now goes directly to /report */}
            <li>
              <Link
                href="/report"
                className="hover:text-slate-900 transition-colors"
              >
                Report items
              </Link>
            </li>

            <li>
              <Link
                href="/howitworks"
                className="hover:text-slate-900 transition-colors"
              >
                How it works
              </Link>
            </li>
          </ul>
        </nav>

        {/* CENTER LOGO */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/updatedlogo.png"
              alt="UniFind Logo"
              width={98}
              height={98}
              priority
              className="object-contain"
            />
            <span className="sr-only">UniFind</span>
          </Link>
        </div>

        {/* RIGHT NAV (DESKTOP) */}
        <nav className="hidden md:flex justify-end">
          <ul className="flex items-center gap-6 text-slate-700 font-medium">
            <li>
              <Link
                href="/rewards"
                className="hover:text-slate-900 transition-colors"
              >
                Rewards
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-slate-900 transition-colors"
              >
                Contact
              </Link>
            </li>

            <AuthLinks />
          </ul>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden justify-self-end rounded-md p-2 text-slate-700 focus:outline-none"
          aria-label="Open menu"
          aria-expanded={open}
        >
          ☰
        </button>
      </Container>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <nav className="px-4 py-3">
            <ul className="flex flex-col gap-3 text-slate-700 font-medium">
              <li>
                <Link
                  href="/campus/select/lost"
                  onClick={() => setOpen(false)}
                  className="block py-1"
                >
                  Lost items
                </Link>
              </li>

              {/* ✔ UPDATED: Mobile version also goes to /report */}
              <li>
                <Link
                  href="/report"
                  onClick={() => setOpen(false)}
                  className="block py-1"
                >
                  Report items
                </Link>
              </li>

              <li>
                <Link
                  href="/howitworks"
                  onClick={() => setOpen(false)}
                  className="block py-1"
                >
                  How it works
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="block py-1"
                >
                  Contact
                </Link>
              </li>

              <li className="pt-2">
                {session ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="w-full block text-center rounded-lg bg-blue-500 text-white px-4 py-2 font-bold transition mb-2"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleSignOut();
                      }}
                      className="w-full block text-center rounded-lg bg-red-500 text-white px-4 py-2 font-bold transition"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="w-full block text-center rounded-lg bg-[#F5B700] px-4 py-2 font-bold text-black hover:brightness-105 transition"
                  >
                    Sign in
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
