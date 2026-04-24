"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const errorDescription = useMemo(
    () => searchParams.get("error_description") || searchParams.get("error"),
    [searchParams],
  );

  useEffect(() => {
    let ignore = false;

    async function finishOAuth() {
      if (!supabase) {
        if (!ignore) {
          setError("Authentication service unavailable. Please check your environment configuration.");
        }
        return;
      }

      if (errorDescription) {
        if (!ignore) {
          setError(errorDescription);
        }
        return;
      }

      if (!code) {
        if (!ignore) {
          setError("Missing OAuth code. Please try signing in again.");
        }
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        if (!ignore) {
          setError(exchangeError.message);
        }
        return;
      }

      router.replace("/dashboard");
    }

    void finishOAuth();

    return () => {
      ignore = true;
    };
  }, [code, errorDescription, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#eef5fb_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-[0_24px_70px_-40px_rgba(15,23,42,0.35)]">
        <h1 className="text-2xl font-black text-slate-950">Finishing sign in</h1>
        {error ? (
          <>
            <p className="mt-4 text-sm leading-6 text-red-600">{error}</p>
            <button
              onClick={() => router.replace("/login")}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-[#4B7C9B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3A627B]"
            >
              Back to login
            </button>
          </>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-600">
            We&apos;re securely connecting your Google account and preparing your dashboard.
          </p>
        )}
      </div>
    </div>
  );
}
