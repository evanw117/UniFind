"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "../AuthContext";
import {
  LogOut,
  FileText,
  Briefcase,
  Settings,
  Mail,
  TrendingUp,
  Zap,
} from "lucide-react";

const primaryButtonStyle =
  "bg-[#4B7C9B] hover:bg-[#6ea4bf] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2 w-full";
const accentButtonStyle =
  "bg-[#F5B700] hover:brightness-105 text-black font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2 w-full";
const dangerButtonStyle =
  "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200 flex items-center gap-2";

type DashboardStats = {
  lostItemsReported: number;
  foundItemsReported: number;
  rewardPoints: number;
};

const defaultStats: DashboardStats = {
  lostItemsReported: 0,
  foundItemsReported: 0,
  rewardPoints: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    let ignore = false;

    async function loadDashboardStats() {
      if (isLoading) {
        return;
      }

      if (!supabase || !user) {
        if (!ignore) {
          setStats(defaultStats);
          setStatsLoading(false);
        }
        return;
      }

      setStatsLoading(true);

      const [{ count: lostCount, error: lostError }, { count: foundCount, error: foundError }, { data: userPointsRow, error: pointsError }] =
        await Promise.all([
          supabase
            .from("lost_and_found_items")
            .select("id", { count: "exact", head: true })
            .eq("reporter_user_id", user.id)
            .eq("status", true),
          supabase
            .from("lost_and_found_items")
            .select("id", { count: "exact", head: true })
            .eq("reporter_user_id", user.id)
            .eq("status", false),
          supabase.from("users").select("points").eq("id", user.id).maybeSingle(),
        ]);

      if (!ignore) {
        setStats({
          lostItemsReported: lostError ? 0 : lostCount ?? 0,
          foundItemsReported: foundError ? 0 : foundCount ?? 0,
          rewardPoints: pointsError ? 0 : userPointsRow?.points ?? 0,
        });
        setStatsLoading(false);
      }
    }

    void loadDashboardStats();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  const handleSignOut = async () => {
    if (!supabase) {
      console.error("Database connection not available");
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
  };

  const handlePasswordReset = () => {
    console.log(`Password reset link requested for ${user?.email}`);
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-xl font-medium text-slate-700">
          <span className="animate-pulse">Checking session...</span>
        </div>
      </div>
    );
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    accentBg,
  }: {
    title: string;
    value: string;
    icon: any;
    color: string;
    accentBg: string;
  }) => (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-lg">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-1 text-3xl font-extrabold text-slate-900">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${accentBg}`}>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-0">
      <header className="relative overflow-hidden bg-[linear-gradient(180deg,#4B7C9B,40%,#6ea4bf)] pb-24 pt-16 text-white">
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight md:text-5xl">
            Your Personal Dashboard
          </h1>
          <p className="text-xl font-light text-white/90">
            Hi, {user.email?.split("@")[0] || "User"}! Welcome back to UniFind.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-[80px] w-full overflow-hidden">
          <div className="absolute inset-0 flex h-full w-[200%] animate-wave">
            <svg
              viewBox="0 0 1440 120"
              className="block h-full w-1/2 text-white"
              preserveAspectRatio="none"
            >
              <path
                fill="currentColor"
                d="M0,64 C240,128 360,0 720,64 C1080,128 1200,0 1440,64 L1440,120 L0,120 Z"
              />
            </svg>
            <svg
              viewBox="0 0 1440 120"
              className="block h-full w-1/2 text-white"
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

      <div className="relative z-20 mx-auto -mt-4 max-w-5xl px-4 sm:px-6 lg:px-8">
        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="Lost Items Reported"
            value={statsLoading ? "..." : String(stats.lostItemsReported)}
            icon={FileText}
            color="text-red-500"
            accentBg="bg-red-100"
          />
          <StatCard
            title="Found Items Reported"
            value={statsLoading ? "..." : String(stats.foundItemsReported)}
            icon={Briefcase}
            color="text-[#4B7C9B]"
            accentBg="bg-[#4B7C9B]/10"
          />
          <StatCard
            title="Reward Points"
            value={statsLoading ? "..." : String(stats.rewardPoints)}
            icon={Zap}
            color="text-[#F5B700]"
            accentBg="bg-[#F5B700]/10"
          />
        </section>

        <div className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="mb-6 flex items-center text-2xl font-bold text-slate-800">
                <TrendingUp className="mr-2 h-6 w-6 text-green-500" /> Current Activity
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  className={accentButtonStyle}
                  onClick={() => router.push("/campus/select/report")}
                >
                  <Briefcase className="h-5 w-5" />
                  Report New Item
                </button>
                <button
                  className={primaryButtonStyle}
                  onClick={() => router.push("/my-reports")}
                >
                  <FileText className="h-5 w-5" />
                  View My Reports
                </button>
              </div>

              <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-700">Notifications</p>
                <p className="mt-1 text-sm text-slate-500">
                  Your dashboard stats now update from Supabase based on your signed-in account.
                </p>
              </div>
            </div>

            <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-slate-400">
                Future feature: Detailed Report History Timeline
              </p>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center text-xl font-bold text-slate-800">
                <Settings className="mr-2 h-5 w-5" /> Account Settings
              </h2>

              <div className="space-y-4 pt-2">
                <div className="border-b pb-3">
                  <h3 className="flex items-center font-medium text-slate-700">
                    <Mail className="mr-2 h-4 w-4 text-slate-500" /> Email Address
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                </div>

                <div>
                  <button
                    onClick={handlePasswordReset}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Request Password Reset
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-slate-800">End Session</h2>
              <button onClick={handleSignOut} className={dangerButtonStyle}>
                <LogOut className="h-5 w-5" />
                Sign Out Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
