// src/app/dashboard/page.tsx - OPTION C: TIERED VERTICAL LAYOUT (Stats Bar Position Adjusted)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; 
import { useAuth } from "../AuthContext"; 
import { User, LogOut, FileText, Briefcase, Settings, Mail, TrendingUp, Zap } from 'lucide-react'; 

// --- Custom Button Styles ---
const primaryButtonStyle = "bg-[#4B7C9B] hover:bg-[#6ea4bf] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2 w-full";
const accentButtonStyle = "bg-[#F5B700] hover:brightness-105 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2 w-full";
const dangerButtonStyle = "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center gap-2";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // --- Auth Guard ---
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/"); 
  };
  
  // NOTE: Swapping out the `alert()` below for a simple console log,
  // as alerts are forbidden in this environment.
  const handlePasswordReset = () => {
      console.log(`Password reset link requested for ${user.email}`);
      // In a real app, you would call supabase.auth.resetPasswordForEmail(user.email) here.
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-xl font-medium text-slate-700">
              <span className="animate-pulse">Checking session...</span>
          </div>
      </div>
    );
  }

  // --- Helper Component for Stat Cards ---
  const StatCard = ({ title, value, icon: Icon, color, accentBg }: { title: string, value: string, icon: any, color: string, accentBg: string }) => (
      <div className="bg-white p-5 rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
          <div>
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${accentBg}`}>
              <Icon className={`w-8 h-8 ${color}`} />
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-white py-0"> 
      
      {/* --- WAVY HEADER SECTION --- */}
      {/* Shadow was removed in the last revision */}
      <header className="relative overflow-hidden bg-[linear-gradient(180deg,#4B7C9B,40%,#6ea4bf)] pt-16 pb-24 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                Your Personal Dashboard
            </h1>
            <p className="text-xl font-light text-white/90">
                Hi, {user.email?.split('@')[0] || "User"}! Welcome back to UniFind.
            </p>
        </div>
        
        {/* Custom Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full h-[80px] overflow-hidden">
            <div className="absolute inset-0 flex w-[200%] h-full animate-wave">
                <svg
                    viewBox="0 0 1440 120"
                    className="block w-1/2 h-full text-white" 
                    preserveAspectRatio="none"
                >
                    <path
                        fill="currentColor"
                        d="M0,64 C240,128 360,0 720,64 C1080,128 1200,0 1440,64 L1440,120 L0,120 Z"
                    />
                </svg>
                <svg
                    viewBox="0 0 1440 120"
                    className="block w-1/2 h-full text-white"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="currentColor"
                        d="M0,64 C240,128 360,0 720,64 C1080,128 1200,0 1440,64 L1440,120 L0,120 Z"
                    />
                </svg>
            </div>
        </div>
      </header>


      {/* 🎯 FIX APPLIED: Changed -mt-12 to -mt-4 to move the content block (and the stats bar) lower. */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        
        {/* --- 1. STATS BAR (Full Width) --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard title="Lost Items Reported" value="0" icon={FileText} color="text-red-500" accentBg="bg-red-100" />
            <StatCard title="Found Items Matched" value="0" icon={Briefcase} color="text-[#4B7C9B]" accentBg="bg-[#4B7C9B]/10" />
            <StatCard title="Reward Points" value="25" icon={Zap} color="text-[#F5B700]" accentBg="bg-[#F5B700]/10" />
        </section>

        {/* --- 2. TWO-COLUMN MAIN CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
            
            {/* LEFT COLUMN: QUICK ACTIONS (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Quick Actions Panel */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2 text-green-500" /> Current Activity
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className={accentButtonStyle}>
                            <Briefcase className="w-5 h-5" />
                            Report New Item
                        </button>
                        <button className={primaryButtonStyle}>
                            <FileText className="w-5 h-5" />
                            View My Reports
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-sm font-medium text-slate-700">Notifications</p>
                        <p className="text-sm text-slate-500 mt-1">
                            No recent matches found for your lost items. Keep checking back!
                        </p>
                    </div>
                </div>

                {/* Placeholder for future detailed reports chart/table */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200 h-64 flex items-center justify-center">
                    <p className="text-slate-400">Future feature: Detailed Report History Timeline</p>
                </div>
            </div>

            {/* RIGHT COLUMN: ACCOUNT MANAGEMENT (1/3 width on large screens) */}
            <div className="lg:col-span-1 space-y-8">
                
                <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2" /> Account Settings
                    </h2>
                    
                    <div className="space-y-4 pt-2">
                        <div className="border-b pb-3">
                            <h3 className="font-medium text-slate-700 flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-slate-500" /> Email Address
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                        </div>

                        <div>
                            <button
                                onClick={handlePasswordReset} 
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Request Password Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sign Out Panel */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">
                        End Session
                    </h2>
                    <button
                        onClick={handleSignOut}
                        className={dangerButtonStyle}
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out Now
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}