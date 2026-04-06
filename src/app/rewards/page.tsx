"use client";

import React, { useState } from "react";
import Footer from "../Footer";
import Container from "../../ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee, BookOpen, Shirt, ShoppingBag, Headphones,
  Ticket, Gift, Star, ChevronDown, Search, Check,
  Calendar, Lock, Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tier = "Bronze" | "Silver" | "Gold" | "Platinum";

interface Reward {
  icon: React.ReactNode;
  title: string;
  cost: number;
  description: string;
}

interface TierConfig {
  name: Tier;
  emoji: string;
  minPts: number;
  color: string;
  bg: string;
  border: string;
  rewards: Reward[];
}

interface Achievement {
  icon: string;
  name: string;
  desc: string;
  earned: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TIER_CONFIGS: TierConfig[] = [
  {
    name: "Bronze", emoji: "🥉", minPts: 0,
    color: "#c8956a", bg: "#fdf0e6", border: "#f0c9a0",
    rewards: [
      { icon: <Coffee size={22} strokeWidth={1.5} />, title: "Free Coffee Voucher", cost: 100, description: "A free coffee at your campus café." },
      { icon: <BookOpen size={22} strokeWidth={1.5} />, title: "Refill Pad", cost: 200, description: "A refill pad from the student union shop." },
      { icon: <Shirt size={22} strokeWidth={1.5} />, title: "College T-Shirt", cost: 300, description: "An official student college T-shirt." },
    ],
  },
  {
    name: "Silver", emoji: "🥈", minPts: 100,
    color: "#5a8fa0", bg: "#eaf4f9", border: "#b0d4e4",
    rewards: [
      { icon: <Ticket size={22} strokeWidth={1.5} />, title: "Campus Event Ticket", cost: 400, description: "Free entry to a campus society event of your choice." },
      { icon: <ShoppingBag size={22} strokeWidth={1.5} />, title: "SU Shop Voucher", cost: 500, description: "€10 voucher redeemable in the student union shop." },
      { icon: <Coffee size={22} strokeWidth={1.5} />, title: "Café Loyalty Card", cost: 600, description: "A 5-stamp loyalty card for the campus café." },
    ],
  },
  {
    name: "Gold", emoji: "🥇", minPts: 300,
    color: "#d4900a", bg: "#fdf8ec", border: "#f0d98a",
    rewards: [
      { icon: <Headphones size={22} strokeWidth={1.5} />, title: "Wireless Earbuds", cost: 800, description: "A pair of wireless earbuds from the campus tech store." },
      { icon: <Gift size={22} strokeWidth={1.5} />, title: "€25 Amazon Voucher", cost: 1000, description: "€25 Amazon gift card redeemable online." },
      { icon: <Star size={22} strokeWidth={1.5} />, title: "UniFind Hoodie", cost: 1200, description: "Exclusive limited-edition UniFind branded hoodie." },
    ],
  },
  {
    name: "Platinum", emoji: "💎", minPts: 600,
    color: "#4B7C9B", bg: "#e6f1fb", border: "#a8ccdf",
    rewards: [
      { icon: <Gift size={22} strokeWidth={1.5} />, title: "€50 Campus Voucher", cost: 1500, description: "€50 voucher valid across all campus shops and cafés." },
      { icon: <Star size={22} strokeWidth={1.5} />, title: "Priority Lost Item Support", cost: 2000, description: "Your lost item reports are pinned and prioritised." },
      { icon: <Headphones size={22} strokeWidth={1.5} />, title: "Premium Tech Bundle", cost: 2500, description: "Noise-cancelling headphones + a portable charger." },
    ],
  },
];

const ACHIEVEMENTS: Achievement[] = [
  { icon: "🔍", name: "First Report",   desc: "Submit your first lost item", earned: false },
  { icon: "🤝", name: "Good Samaritan", desc: "Return 3 found items",        earned: false },
  { icon: "🏆", name: "Campus Hero",    desc: "Return 10 found items",       earned: false },
  { icon: "🔥", name: "On a Streak",    desc: "3 week active streak",        earned: false },
  { icon: "⭐", name: "Silver Climber", desc: "Reach Silver tier",           earned: false },
  { icon: "💛", name: "Gold Standard",  desc: "Reach Gold tier",             earned: false },
  { icon: "💎", name: "Platinum Elite", desc: "Reach Platinum tier",         earned: false },
  { icon: "🎯", name: "Sharp Eye",      desc: "Report 5 lost items",         earned: false },
];

const HOW_TO_EARN = [
  { icon: <Search size={18} strokeWidth={1.8} />,   name: "Report a lost item",  desc: "Submit a lost item listing",     pts: "+10 pts", bg: "#eaf4f9", color: "#4B7C9B" },
  { icon: <Check size={18} strokeWidth={1.8} />,    name: "Return a found item", desc: "Hand back an item to its owner", pts: "+25 pts", bg: "#e8f8f2", color: "#1a9e6a" },
  { icon: <Star size={18} strokeWidth={1.8} />,     name: "First login",         desc: "Create your UniFind account",    pts: "+5 pts",  bg: "#fdf8ec", color: "#d4900a" },
  { icon: <Calendar size={18} strokeWidth={1.8} />, name: "Weekly activity",     desc: "Log in 3+ days in a week",       pts: "+15 pts", bg: "#f3eeff", color: "#7c5cbf" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCurrentTier(points: number): TierConfig {
  return [...TIER_CONFIGS].reverse().find((t) => points >= t.minPts) ?? TIER_CONFIGS[0];
}
function getNextTier(points: number): TierConfig | null {
  return TIER_CONFIGS.find((t) => t.minPts > points) ?? null;
}

// ─── Reward Card (ticket / voucher style) ────────────────────────────────────
function RewardCard({ reward, points, tierColor, tierBg }: {
  reward: Reward; points: number; tierColor: string; tierBg: string;
}) {
  const canRedeem = points >= reward.cost;
  const progress = Math.min((points / reward.cost) * 100, 100);
  const ptsAway = reward.cost - points;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm"
      style={{ border: `1.5px solid ${canRedeem ? tierColor : "#e2eef5"}` }}
    >
      {/* Top colour band */}
      <div className="h-2 w-full" style={{ background: tierColor }} />

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: tierBg, color: tierColor }}
          >
            {reward.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#1e3f54] leading-tight">{reward.title}</h3>
            <p className="text-xs text-[#8aacbd] mt-0.5 leading-relaxed">{reward.description}</p>
          </div>
        </div>

        {/* Dashed tear line */}
        <div className="relative border-t-2 border-dashed border-[#e8f0f5] my-3 mx-[-16px]">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#f0f7fb]" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#f0f7fb]" />
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <div
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
            style={{ background: tierBg, color: tierColor }}
          >
            <Zap size={10} />
            {reward.cost} pts
          </div>
          {canRedeem ? (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">✓ Ready</span>
          ) : (
            <span className="text-xs text-[#9ab8c8]">{ptsAway} away</span>
          )}
        </div>

        {!canRedeem && (
          <div className="w-full bg-[#f0f7fb] rounded-full h-1.5 overflow-hidden mb-3">
            <motion.div
              className="h-full rounded-full"
              style={{ background: tierColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
        )}

        <button
          disabled={!canRedeem}
          className="w-full py-2.5 rounded-xl text-xs font-bold transition-all"
          style={
            canRedeem
              ? { background: tierColor, color: "white" }
              : { background: "#f0f4f6", color: "#a8bfc8", cursor: "not-allowed" }
          }
        >
          {canRedeem ? "Redeem Reward" : "Not enough points"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Tier Dropdown ────────────────────────────────────────────────────────────
function TierDropdown({ tier, points, isOpen, onToggle, isCurrentTier }: {
  tier: TierConfig; points: number; isOpen: boolean; onToggle: () => void; isCurrentTier: boolean;
}) {
  const isUnlocked = points >= tier.minPts;
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        border: isCurrentTier ? `2px solid ${tier.color}` : "1.5px solid #e2eef5",
        background: "white",
        boxShadow: isCurrentTier ? `0 4px 24px ${tier.color}28` : undefined,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-[#f8fbfd]"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: tier.bg, border: `1.5px solid ${tier.border}` }}
        >
          {tier.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-[#1e3f54]">{tier.name} Tier</span>
            {isCurrentTier && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white" style={{ background: tier.color }}>
                Current
              </span>
            )}
            {!isUnlocked && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#f0f4f6] text-[#a8bfc8] px-2.5 py-0.5 rounded-full">
                <Lock size={10} /> {tier.minPts} pts to unlock
              </span>
            )}
          </div>
          <p className="text-xs text-[#9ab8c8] mt-0.5">{tier.rewards.length} rewards · {tier.minPts}+ pts</p>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-[#9ab8c8]" />
        </motion.div>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                {tier.rewards.map((reward) => (
                  <RewardCard
                    key={reward.title}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RewardsPage() {
  // ← Swap "David" with your auth hook: session?.user?.name ?? "there"
  const user = { name: "David", points: 0 };

  const currentTier = getCurrentTier(user.points);
  const nextTier = getNextTier(user.points);
  const ptsToNext = nextTier ? nextTier.minPts - user.points : 0;
  const progressPct = nextTier
    ? ((user.points - currentTier.minPts) / (nextTier.minPts - currentTier.minPts)) * 100
    : 100;

  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({ Bronze: true });
  const toggleTier = (name: string) => setOpenTiers((p) => ({ ...p, [name]: !p[name] }));

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(170deg, #ddeef7 0%, #eaf4f9 40%, #f5fbff 100%)" }}
    >
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
          style={{ background: "#6ea4bf", filter: "blur(80px)" }} />
        <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: "#F5B700", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full opacity-20"
          style={{ background: "#4B7C9B", filter: "blur(70px)" }} />
      </div>

      <Container>
        <div className="pt-28 pb-16 max-w-4xl mx-auto space-y-6 relative z-10">

          {/* ── Hero Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden p-8"
            style={{ background: "linear-gradient(135deg, #4B7C9B 0%, #6ea4bf 60%, #8fc0d6 100%)" }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-10" />
            <div className="absolute bottom-[-20px] right-[70px] w-28 h-28 rounded-full bg-white opacity-10" />
            <div className="absolute top-4 right-40 w-14 h-14 rounded-full opacity-15" style={{ background: "#F5B700" }} />

            <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
              <div>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">UniFind Rewards</p>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  Hey, <span className="text-[#F5B700]">{user.name}</span> 👋
                </h1>
                <p className="text-white/70 text-sm mt-2 max-w-xs leading-relaxed">
                  Report and return items to earn UniPoints and unlock campus perks.
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-8 py-5 text-center min-w-[130px]">
                <div className="text-4xl font-black text-white leading-none">{user.points}</div>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className="text-lg">🔥</span>
                  <span className="text-xs font-bold text-white/65 uppercase tracking-wider">UniPoints</span>
                </div>
              </div>
            </div>

            {/* Tier progress inside banner */}
            <div className="relative z-10 mt-6 bg-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{currentTier.emoji}</span>
                  <span className="text-sm font-bold text-white">{currentTier.name} Tier</span>
                </div>
                {nextTier && (
                  <span className="text-xs text-white/60">{ptsToNext} pts to {nextTier.emoji} {nextTier.name}</span>
                )}
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-0 right-0 h-px bg-white/20 top-[9px] z-0" />
                {TIER_CONFIGS.map((tier) => {
                  const unlocked = user.points >= tier.minPts;
                  const isCurr = tier.name === currentTier.name;
                  return (
                    <div key={tier.name} className="flex-1 flex flex-col items-center relative z-10">
                      <div
                        className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center mb-1"
                        style={{
                          background: isCurr ? "#F5B700" : unlocked ? "white" : "rgba(255,255,255,0.2)",
                          borderColor: isCurr ? "#F5B700" : unlocked ? "white" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {isCurr && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[10px] text-white/55 font-semibold">{tier.name}</span>
                    </div>
                  );
                })}
              </div>
              {nextTier && (
                <div className="mt-3 bg-white/15 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    className="h-full bg-[#F5B700] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* ── How to Earn — coloured stat cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            <p className="text-xs font-bold text-[#7a9eb0] uppercase tracking-widest mb-3">How to earn points</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {HOW_TO_EARN.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-2xl p-4 border border-[#e2eef5] shadow-sm"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-[#1e3f54] leading-tight mb-0.5">{item.name}</div>
                  <div className="text-xs text-[#9ab8c8] mb-2 leading-snug">{item.desc}</div>
                  <div className="text-sm font-extrabold" style={{ color: item.color }}>{item.pts}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Tier Rewards Dropdowns ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <p className="text-xs font-bold text-[#7a9eb0] uppercase tracking-widest mb-3">Rewards by tier</p>
            <div className="space-y-3">
              {TIER_CONFIGS.map((tier) => (
                <TierDropdown
                  key={tier.name}
                  tier={tier}
                  points={user.points}
                  isOpen={!!openTiers[tier.name]}
                  onToggle={() => toggleTier(tier.name)}
                  isCurrentTier={tier.name === currentTier.name}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Achievements ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <p className="text-xs font-bold text-[#7a9eb0] uppercase tracking-widest">Achievements</p>
              <div className="flex-1 h-px bg-[#daeaf3]" />
              <span className="text-xs text-[#9ab8c8]">
                {ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length} earned
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACHIEVEMENTS.map((ach, i) => (
                <motion.div
                  key={ach.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.05, duration: 0.4 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="relative bg-white rounded-2xl p-4 text-center border shadow-sm overflow-hidden"
                  style={{
                    borderColor: ach.earned ? "#4B7C9B" : "#e2eef5",
                    opacity: ach.earned ? 1 : 0.55,
                  }}
                >
                  <div className="relative z-10">
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-3xl"
                      style={{ background: ach.earned ? "#eaf4f9" : "#f5f8fa" }}
                    >
                      {ach.icon}
                    </div>
                    <div className="text-xs font-bold text-[#1e3f54] mb-1 leading-tight">{ach.name}</div>
                    <div className="text-xs text-[#9ab8c8] leading-snug mb-2">{ach.desc}</div>
                    <div
                      className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={
                        ach.earned
                          ? { background: "#eaf4f9", color: "#4B7C9B" }
                          : { background: "#f0f4f6", color: "#b0c8d4" }
                      }
                    >
                      {ach.earned ? <><Check size={10} /> Earned</> : <><Lock size={10} /> Locked</>}
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
