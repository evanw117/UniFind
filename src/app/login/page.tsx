// src/app/login/page.tsx - OPTION 3: Clean, Card-Header Look (Logo Removed, OAuth Added)
"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../AuthContext'; 
// import Image from 'next/image'; // <-- Removed

export default function LoginPage() {
  const router = useRouter();
  const { session, isLoading } = useAuth(); 

  // --- 1. REDIRECTION LOGIC ---
  useEffect(() => {
    if (!isLoading && session) {
      router.push('/dashboard'); 
    }
  }, [session, isLoading, router]);

  // --- 2. TIGHTENED RENDER CHECK ---
  if (isLoading || session) {
    return (
        <div className="min-h-screen flex items-center justify-center text-lg text-slate-700">
            Checking session...
        </div>
    );
  }

  // --- 3. RENDER LOGIN FORM (Styled) ---
  return (
    // Outer container with a subtle background gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0eaf3] to-white p-4">
      
      {/* Login Card Container - Clean and structured */}
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 
                   // Custom Inner Shadow for depth and a focus ring on hover
                   hover:ring-4 hover:ring-[#F5B700]/50 transition duration-300"
      >
        
        {/* Header with Title */}
        <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-extrabold text-[#4B7C9B]">UniFind</h1>
            
            {/* Logo component removed here */}
            
            <p className="text-lg font-semibold text-slate-700 mt-2 border-t border-slate-200 pt-4 w-full text-center">
              Sign In / Sign Up
            </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  // Primary color (buttons, links, focus outline) matching UniFind blue/teal
                  brand: '#4b7c9bff', 
                  // Use the accent color for hover state
                  brandAccent: '#3710d5ff', // Changed this to a highly visible color
                  inputBackground: '#f8fafd',
                  // Ensure text is white on the blue primary button
                  brandButtonText: 'white', 
                },
                space: {
                    buttonPadding: '12px 18px', 
                    inputPadding: '12px 15px',
                },
                radii: {
                    borderRadiusButton: '0.5rem', 
                    borderRadiusInput: '0.5rem',
                }
              },
            },
          }}
          localization={{
            variables: {
                // Made the labels more formal
                sign_in: { email_label: 'University Email Address', password_label: 'Password' }
            }
          }}
          
          // 🎯 FIX: Added 'azure' for Microsoft/Outlook sign-in
          providers={['google', 'azure']} 
          redirectTo={`${window.location.origin}/dashboard`} 
        />
      </div>
    </div>
  );
}