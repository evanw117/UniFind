// src/app/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import Container from "@/ui/Container";



export default function Footer() {
  return (
    <footer className="relative mt-20">
      {/* soft top wave */}
      <svg
        viewBox="0 0 1440 80"
        className="pointer-events-none block w-full text-slate-50"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,32 C180,80 360,0 720,32 C1080,64 1260,16 1440,32 L1440,80 L0,80 Z"
        />
      </svg>

      <div className="border-t border-slate-200/70 bg-gradient-to-b from-[#eef6fb] to-white">
        <Container className="py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Brand */}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logotest.png"
                alt="UniFind"
                width={36}
                height={36}
                className="rounded-md"
              />
              <span className="text-xl font-semibold text-slate-800">UniFind</span>
            </Link>

            {/* Nav */}
            <nav aria-label="Footer" className="text-sm">
              <ul className="flex flex-wrap gap-x-6 gap-y-3 text-slate-600 font-medium">
                <li><Link href="/#lost" className="hover:text-sky-700 transition-colors">Lost items</Link></li>
                <li><Link href="/#found" className="hover:text-sky-700 transition-colors">Found items</Link></li>
                <li><Link href="/#how" className="hover:text-sky-700 transition-colors">How it Works</Link></li>
                <li><Link href="/#rewards" className="hover:text-sky-700 transition-colors">Rewards</Link></li>
                <li><Link href="/#contact" className="hover:text-sky-700 transition-colors">Contact</Link></li>
              </ul>
            </nav>

            {/* Socials */}
            <div className="flex items-center gap-3">
              <a
                aria-label="Twitter"
                href="https://x.com"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-200 hover:ring-sky-400/60 transition"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-slate-700">
                  <path d="M18.9 3H22l-7.2 8.2L23.5 21H16l-5-6.3L5 21H1.9l7.6-8.8L.8 3H8l4.6 5.8L18.9 3z" />
                </svg>
              </a>
              <a
                aria-label="Instagram"
                href="https://instagram.com"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-slate-200 hover:ring-sky-400/60 transition"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-slate-700">
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-1 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.3.4-1.2.1-1.6.1-4.7.1s-3.6 0-4.7-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-1-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.6.5-1 1-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* NEW: Recently Reported feed */}
          

          {/* bottom row */}
          <div className="mt-8 border-t border-slate-200/70 pt-6 text-sm text-slate-500 flex flex-col items-center gap-2 md:flex-row md:justify-between">
            <p>© {new Date().getFullYear()} UniFind. All rights reserved.</p>
            <div className="flex gap-5">
              <Link href="/privacy" className="hover:text-sky-700 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-sky-700 transition-colors">Terms</Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
