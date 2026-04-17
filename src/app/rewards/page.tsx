"use client";

import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import Container from "../../ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Check,
  ChevronDown,
  Coffee,
  Gift,
  Headphones,
  Lock,
  Search,
  Shirt,
  ShoppingBag,
  Star,
  Ticket,
  Zap,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/app/AuthContext";
import {
  REPORT_POINTS,
  REWARD_TIERS,
  VALUE_TIER_CONFIG,
  getCurrentTier,
  getNextTier,
  getRewardsByTier,
  type RewardCatalogItem,
  type RewardTierConfig,
} from "@/lib/rewardConfig";

interface Achievement {
  icon: string;
  name: string;
  desc: string;
  earned: boolean;
}

type RewardActivityRow = {
  status: boolean;
  created_at: string | null;
  returned_at: string | null;
};

type DisplayReward = RewardCatalogItem & {
  icon: React.ReactNode;
};

const rewardIcons: Record<RewardCatalogItem["iconKey"], React.ReactNode> = {
  coffee: <Coffee size={22} strokeWidth={1.5} />,
  book: <BookOpen size={22} strokeWidth={1.5} />,
  shirt: <Shirt size={22} strokeWidth={1.5} />,
  bag: <ShoppingBag size={22} strokeWidth={1.5} />,
  headphones: <Headphones size={22} strokeWidth={1.5} />,
  ticket: <Ticket size={22} strokeWidth={1.5} />,
  gift: <Gift size={22} strokeWidth={1.5} />,
  star: <Star size={22} strokeWidth={1.5} />,
};

const ACHIEVEMENTS: Achievement[] = [
  { icon: "🔍", name: "First Report", desc: "Submit your first found item", earned: false },
  { icon: "🤝", name: "Good Samaritan", desc: "Return 3 found items", earned: false },
  { icon: "🏆", name: "Campus Hero", desc: "Return 10 found items", earned: false },
  { icon: "🔥", name: "On a Streak", desc: "3 week active streak", earned: false },
  { icon: "⭐", name: "Silver Climber", desc: "Reach Silver tier", earned: false },
  { icon: "💛", name: "Gold Standard", desc: "Reach Gold tier", earned: false },
  { icon: "💎", name: "Platinum Elite", desc: "Reach Platinum tier", earned: false },
  { icon: "🎯", name: "Sharp Eye", desc: "Report 5 found items", earned: false },
];

const HOW_TO_EARN = [
  {
    icon: <Search size={18} strokeWidth={1.8} />,
    name: "Report a found item",
    desc: "Submit a found item listing to help start a match",
    pts: `+${REPORT_POINTS} pts`,
    bg: "#eaf4f9",
    color: "#4B7C9B",
  },
  {
    icon: <Check size={18} strokeWidth={1.8} />,
    name: "Return a low-value item",
    desc: "Keys, bottles, or other everyday items",
    pts: `+${VALUE_TIER_CONFIG.low.estimatedReturnPoints} pts`,
    bg: "#e8f8f2",
    color: "#1a9e6a",
  },
  {
    icon: <Star size={18} strokeWidth={1.8} />,
    name: "Return a medium-value item",
    desc: "Wallets, bags, or other important personal items",
    pts: `+${VALUE_TIER_CONFIG.medium.estimatedReturnPoints} pts`,
    bg: "#fdf8ec",
    color: "#d4900a",
  },
  {
    icon: <Calendar size={18} strokeWidth={1.8} />,
    name: "Return a high-value item",
    desc: "AirPods, phones, or higher-value tech and essentials",
    pts: `+${VALUE_TIER_CONFIG.high.estimatedReturnPoints} pts`,
    bg: "#f3eeff",
    color: "#7c5cbf",
  },
];

function getTierRewards(tierName: RewardTierConfig["name"]): DisplayReward[] {
  return getRewardsByTier(tierName).map((reward) => ({
    ...reward,
    icon: rewardIcons[reward.iconKey],
  }));
}

function getWeekKey(dateValue: string) {
  const date = new Date(dateValue);
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

  return `${utcDate.getUTCFullYear()}-${weekNumber}`;
}

function hasThreeWeekStreak(rows: RewardActivityRow[]) {
  const weekKeys = rows
    .flatMap((row) => [row.created_at, row.returned_at])
    .filter((value): value is string => Boolean(value))
    .map(getWeekKey);

  return new Set(weekKeys).size >= 3;
}

function buildAchievements({
  foundReportsCount,
  confirmedReturnsCount,
  points,
  activityRows,
}: {
  foundReportsCount: number;
  confirmedReturnsCount: number;
  points: number;
  activityRows: RewardActivityRow[];
}) {
  const currentTier = getCurrentTier(points);
  const streakUnlocked = hasThreeWeekStreak(activityRows);

  return ACHIEVEMENTS.map((achievement) => {
    let earned = false;

    switch (achievement.name) {
      case "First Report":
        earned = foundReportsCount >= 1;
        break;
      case "Good Samaritan":
        earned = confirmedReturnsCount >= 3;
        break;
      case "Campus Hero":
        earned = confirmedReturnsCount >= 10;
        break;
      case "On a Streak":
        earned = streakUnlocked;
        break;
      case "Silver Climber":
        earned = currentTier.name === "Silver" || currentTier.name === "Gold" || currentTier.name === "Platinum";
        break;
      case "Gold Standard":
        earned = currentTier.name === "Gold" || currentTier.name === "Platinum";
        break;
      case "Platinum Elite":
        earned = currentTier.name === "Platinum";
        break;
      case "Sharp Eye":
        earned = foundReportsCount >= 5;
        break;
      default:
        earned = achievement.earned;
    }

    return {
      ...achievement,
      earned,
    };
  });
}

function RewardCard({
  reward,
  points,
  tierColor,
  tierBg,
}: {
  reward: DisplayReward;
  points: number;
  tierColor: string;
  tierBg: string;
}) {
  const canRedeem = points >= reward.cost;
  const progress = Math.min((points / reward.cost) * 100, 100);
  const ptsAway = Math.max(0, reward.cost - points);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02, rotateY: 2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, type: "spring", stiffness: 300 }}
      className={`relative overflow-hidden rounded-[1.8rem] border-2 bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${
        canRedeem ? "ring-2 ring-opacity-60 hover:ring-opacity-100" : "hover:border-gray-300"
      }`}
      style={{
        borderColor: canRedeem ? tierColor : "#e2eef5",
        boxShadow: canRedeem
          ? `0 14px 36px -10px ${tierColor}30, 0 6px 16px -6px ${tierColor}15`
          : undefined,
      }}
    >
      <div
        className="h-2 w-full animate-pulse bg-gradient-to-r"
        style={{ background: `linear-gradient(90deg, ${tierColor}bf, ${tierColor}dd, ${tierColor}bf)` }}
      />

      <div className="p-4">
        <div className="mb-3 flex items-start gap-3">
          <motion.div
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[1.25rem] shadow-sm transition-transform duration-300 hover:rotate-12"
            style={{ background: tierBg, color: tierColor, border: `1px solid ${tierColor}33` }}
            whileHover={{ scale: 1.1 }}
          >
            {reward.icon}
          </motion.div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold leading-tight text-[#1e3f54] transition-colors duration-200 hover:text-blue-600">
              {reward.title}
            </h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8aacbd]">
              {reward.description}
            </p>
          </div>
        </div>

        <div className="relative mx-[-16px] my-3 border-t-2 border-dashed border-[#e8f0f5] animate-pulse">
          <div className="absolute -left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#f0f7fb] shadow-sm" />
          <div className="absolute -right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#f0f7fb] shadow-sm" />
        </div>

        <div className="mb-2.5 flex items-center justify-between">
          <motion.div
            className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold shadow-sm transition-transform duration-200 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${tierBg}20, ${tierColor}10)`,
              color: tierColor,
              border: `1px solid ${tierColor}22`,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <Zap size={10} className="animate-pulse" />
            {reward.cost} pts
          </motion.div>
          {canRedeem ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600">
              Ready
            </span>
          ) : (
            <span className="text-xs text-[#9ab8c8]">{ptsAway} away</span>
          )}
        </div>

        {!canRedeem && (
          <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full shadow-inner"
              style={{ background: `linear-gradient(90deg, ${tierColor}dd, ${tierColor}88)` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
        )}

        <motion.button
          disabled={!canRedeem}
          className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all duration-300 ${
            canRedeem
              ? "bg-gradient-to-r from-sky-600 via-cyan-500 to-amber-500 text-white shadow-lg hover:scale-105 hover:shadow-xl"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
          }`}
          whileHover={canRedeem ? { scale: 1.02 } : {}}
          whileTap={canRedeem ? { scale: 0.98 } : {}}
        >
          {canRedeem ? "Redeem reward" : "Not enough points"}
        </motion.button>
      </div>
    </motion.div>
  );
}

function TierDropdown({
  tier,
  points,
  isOpen,
  onToggle,
  isCurrentTier,
}: {
  tier: RewardTierConfig;
  points: number;
  isOpen: boolean;
  onToggle: () => void;
  isCurrentTier: boolean;
}) {
  const rewards = getTierRewards(tier.name);
  const isUnlocked = points >= tier.minPts;

  return (
    <div
      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 shadow-lg transition-all duration-300 hover:-translate-y-0.5"
      style={{
        boxShadow: isCurrentTier ? `0 18px 48px -18px ${tier.color}40` : undefined,
      }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 bg-white p-4 text-left transition-all duration-200 hover:bg-slate-50"
      >
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.5rem] text-2xl shadow-sm"
          style={{ background: tier.bg, border: `1.5px solid ${tier.border}` }}
        >
          {tier.emoji}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-slate-950">{tier.name} tier</span>
            {isCurrentTier && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.25em] text-white"
                style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}
              >
                Current
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {rewards.length} rewards · {tier.minPts}+ pts
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {!isUnlocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
              <Lock size={10} /> {tier.minPts} pts
            </span>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-slate-500" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1" style={{ borderTop: `1px solid ${tier.bg}` }}>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {rewards.map((reward) => (
                  <RewardCard
                    key={reward.id}
                    reward={reward}
                    points={points}
                    tierColor={tier.color}
                    tierBg={tier.bg}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RewardsPage() {
  const { user, isLoading } = useAuth();
  const [points, setPoints] = useState(0);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({ Bronze: true });

  useEffect(() => {
    let ignore = false;

    async function loadPoints() {
      if (isLoading) {
        return;
      }

      if (!supabase || !user) {
        if (!ignore) {
          setPoints(0);
          setPointsLoading(false);
        }
        return;
      }

      setPointsLoading(true);

      const fallbackPoints =
        typeof user.user_metadata?.points === "number" ? user.user_metadata.points : 0;

      const { data, error } = await supabase
        .from("users")
        .select("points")
        .eq("id", user.id)
        .maybeSingle();

      if (!ignore) {
        setPoints(error ? fallbackPoints : data?.points ?? fallbackPoints);
        setPointsLoading(false);
      }
    }

    void loadPoints();

    return () => {
      ignore = true;
    };
  }, [isLoading, user]);

  useEffect(() => {
    let ignore = false;

    async function loadAchievements() {
      if (isLoading) {
        return;
      }

      if (!supabase || !user) {
        if (!ignore) {
          setAchievements(ACHIEVEMENTS);
        }
        return;
      }

      const { data, error } = await supabase
        .from("lost_and_found_items")
        .select("status, created_at, returned_at")
        .eq("reporter_user_id", user.id);

      if (ignore) {
        return;
      }

      if (error || !data) {
        setAchievements(buildAchievements({
          foundReportsCount: 0,
          confirmedReturnsCount: 0,
          points,
          activityRows: [],
        }));
        return;
      }

      const activityRows = data as RewardActivityRow[];
      const foundReportsCount = activityRows.filter((row) => row.status === false).length;
      const confirmedReturnsCount = activityRows.filter(
        (row) => row.status === false && Boolean(row.returned_at),
      ).length;

      setAchievements(
        buildAchievements({
          foundReportsCount,
          confirmedReturnsCount,
          points,
          activityRows,
        }),
      );
    }

    void loadAchievements();

    return () => {
      ignore = true;
    };
  }, [isLoading, points, user]);

  const currentTier = getCurrentTier(points);
  const nextTier = getNextTier(points);
  const ptsToNext = nextTier ? nextTier.minPts - points : 0;
  const progressPct = nextTier
    ? ((points - currentTier.minPts) / (nextTier.minPts - currentTier.minPts)) * 100
    : 100;

  const toggleTier = (name: string) => setOpenTiers((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-slate-50"
      style={{ background: "linear-gradient(170deg, #ffffff 0%, #edf4ff 30%, #fff3e8 70%, #ffffff 100%)" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30"
          style={{ background: "#6ea4bf", filter: "blur(80px)" }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -right-40 top-1/3 h-80 w-80 rounded-full opacity-20"
          style={{ background: "#F5B700", filter: "blur(80px)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Container>
        <div className="relative z-10 mx-auto max-w-4xl space-y-8 pb-16 pt-28">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_30px_80px_-60px_rgba(75,124,155,0.45)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-transparent to-amber-50 opacity-80" />
            <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
              <div className="max-w-2xl">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                  UniFind Rewards
                </p>
                <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
                  Turn Found Items Into{" "}
                  <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
                    Shared Rewards
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-700 md:text-lg">
                  Report found items, help them return, and collect points that unlock
                  campus vouchers, goodies, and premium perks.
                </p>
              </div>

              <motion.div
                className="min-w-[180px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-5xl font-black text-slate-900">
                  {pointsLoading ? "..." : points}
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                  UniPoints
                </p>
                <p className="mt-4 text-sm text-slate-600">Your current reward balance</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">
                    Tier journey
                  </span>
                  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
                    {currentTier.name} status
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    {nextTier
                      ? `${ptsToNext} points to reach ${nextTier.name}.`
                      : "You have unlocked the highest reward tier."}
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-sky-100 bg-sky-50 px-5 py-4 text-center shadow-sm">
                  <p className="text-xs uppercase tracking-[0.35em] text-sky-500">Progress</p>
                  <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                    {Math.max(0, Math.min(100, progressPct)).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-6 h-2 rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-amber-400"
                  style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
                />
              </div>

              <div className="mt-6 grid gap-4">
                {REWARD_TIERS.map((tier) => {
                  const unlocked = points >= tier.minPts;
                  const isCurrent = tier.name === currentTier.name;
                  const tierProgress =
                    tier.minPts === 0 ? 100 : Math.min(100, (points / tier.minPts) * 100);

                  return (
                    <div
                      key={tier.name}
                      className={`rounded-[1.9rem] border p-4 transition-all duration-300 ${
                        isCurrent
                          ? "border-sky-200 bg-sky-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-sky-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-[1.5rem] text-2xl shadow-sm"
                          style={{ background: tier.bg, color: tier.color }}
                        >
                          {tier.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">{tier.name}</p>
                            {isCurrent && (
                              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] uppercase tracking-[0.25em] text-sky-700">
                                current
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">
                            {tier.minPts}+ pts
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                              unlocked
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {unlocked ? "Unlocked" : "Locked"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-amber-400"
                          style={{ width: `${tierProgress}%` }}
                        />
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-slate-600">
                        {unlocked
                          ? "You've reached this tier. Keep going to unlock more rewards."
                          : `Earn ${tier.minPts - points} more points to unlock ${tier.name}.`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-sky-100 bg-sky-50/70 p-6 shadow-lg">
                <p className="text-xs uppercase tracking-[0.35em] text-sky-700">
                  Rewards roadmap
                </p>
                <h3 className="mt-3 text-2xl font-black text-slate-950">What&apos;s next</h3>
                <div className="mt-6 space-y-4">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Current tier</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      You&apos;re currently in {currentTier.name}. Every reward still uses the
                      same shared point costs from the backend config.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900">Next tier</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {nextTier
                        ? `${ptsToNext} more points unlocks ${nextTier.name}.`
                        : "You are already at the top tier."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Reward preview</p>
                <h3 className="mt-3 text-2xl font-black text-slate-950">Ready to claim more</h3>
                <div className="mt-5 grid gap-4">
                  {getTierRewards(currentTier.name).slice(0, 2).map((reward) => (
                    <div
                      key={reward.id}
                      className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">{reward.title}</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        Redeem for {reward.cost} points.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-lg"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">How to earn</p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">Points made simple</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {HOW_TO_EARN.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.06, duration: 0.5 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition-all duration-300 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-2xl shadow-sm"
                      style={{ background: item.bg, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <div
                    className="mt-4 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-sm"
                    style={{ border: `1px solid ${item.color}33` }}
                  >
                    {item.pts}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-lg"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Rewards by tier</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Tier unlocks</h2>
              </div>
            </div>
            <div className="space-y-4">
              {REWARD_TIERS.map((tier) => (
                <TierDropdown
                  key={tier.name}
                  tier={tier}
                  points={points}
                  isOpen={Boolean(openTiers[tier.name])}
                  onToggle={() => toggleTier(tier.name)}
                  isCurrentTier={tier.name === currentTier.name}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(15,23,42,0.12)]"
          >
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Achievements</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950">Milestones that matter</h2>
              </div>
              <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-xl">
                {achievements.filter((achievement) => achievement.earned).length}/{achievements.length} earned
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8, scale: 1.08, rotateY: 10 }}
                  className={`relative overflow-hidden rounded-[1.75rem] border p-5 text-center shadow-lg transition-all duration-300 ${
                    achievement.earned ? "bg-white" : "bg-slate-50"
                  }`}
                  style={{
                    borderColor: achievement.earned ? "#4B7C9B" : "#e2eef5",
                    opacity: achievement.earned ? 1 : 0.86,
                  }}
                >
                  <div className="relative z-10">
                    <motion.div
                      className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-[1.5rem] text-3xl shadow-sm"
                      style={{
                        background: achievement.earned
                          ? "linear-gradient(135deg, #daf4ea, #d8f0ff)"
                          : "linear-gradient(135deg, #eef3ff, #f8fafc)",
                      }}
                    >
                      {achievement.icon}
                    </motion.div>
                    <div className="mb-1 text-xs font-bold leading-tight text-slate-900">
                      {achievement.name}
                    </div>
                    <div className="mb-3 text-xs leading-snug text-slate-500">
                      {achievement.desc}
                    </div>
                    <div
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
                      style={
                        achievement.earned
                          ? { background: "#d9f1e7", color: "#0f766e" }
                          : { background: "#dbeafe", color: "#2563eb" }
                      }
                    >
                      {achievement.earned ? (
                        <>
                          <Check size={10} /> Earned
                        </>
                      ) : (
                        <>
                          <Lock size={10} /> Locked
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
      <Footer />
    </main>
  );
}
