"use client";

import React from "react";
import Footer from "../Footer";
import Container from "../../ui/Container";
import { motion } from "framer-motion";
import { Trophy, Coffee, Ticket, Shirt } from "lucide-react";

export default function RewardsPage() {
  const user = {
    name: "David",
    points: 0,
    tier: "Bronze",
    nextTier: "Silver",
    pointsToNextTier: 100,
  };

  const rewards = [
    {
      icon: <Coffee size={34} strokeWidth={1.5} />,
      title: "Free Coffee Voucher",
      cost: 100,
      description:
        "Redeem a voucher for a free coffee at your campus café — a little boost for your day.",
    },
    {
      icon: <Ticket size={34} strokeWidth={1.5} />,
      title: "Refil Pad",
      cost: 200,
      description:
        "Redeem a refil pad in the student union shop!.",
    },
    {
      icon: <Shirt size={34} strokeWidth={1.5} />,
      title: "College T-Shirt",
      cost: 300,
      description:
        "Redeem a Student College T-Shirt.",
    },
  ];

  const achievements: { title: string; date: string }[] = [];

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#EAF5FB] via-white to-[#FDFBF5] overflow-hidden">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-sky-300/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />
      <motion.div
        className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      <Container>
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center py-20"
        >
          <h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">
            Rewards Dashboard
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
            Earn UniPoints, rise through tiers, and unlock exclusive campus
            perks for doing good deeds.
          </p>
        </motion.div>

        {/* USER SUMMARY CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mx-auto max-w-2xl bg-white/70 backdrop-blur-md rounded-3xl shadow-lg ring-1 ring-slate-200/60 p-10 text-center mb-20"
        >
          <Trophy
            size={48}
            strokeWidth={1.5}
            className="mx-auto mb-4 text-amber-500"
          />
          <h2 className="text-lg font-medium text-slate-600">
            Current Balance
          </h2>
          <motion.p
            className="text-[64px] font-extrabold text-sky-700 leading-none mt-3"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {user.points} pts
          </motion.p>
          <p className="mt-2 text-slate-600 font-medium">
            Tier:{" "}
            <span className="text-amber-500 font-semibold">{user.tier}</span>{" "}
            → Next: {user.nextTier}
          </p>

          {/* Fancy animated progress bar */}
          <div className="relative w-full bg-slate-200 rounded-full h-4 mt-6 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-sky-500 via-sky-600 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(user.points / (user.points + user.pointsToNextTier)) * 100}%`,
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-3">
            {user.pointsToNextTier} pts to reach {user.nextTier} Tier
          </p>
        </motion.div>

        {/* REWARDS SECTION */}
        <section className="mb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold text-slate-800 mb-12 text-center"
          >
            Unlockable Rewards
          </motion.h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map(({ icon, title, cost, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl p-8 shadow-md ring-1 ring-slate-200 hover:ring-sky-400/50 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-sky-700 mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {description}
                </p>
                <p className="font-semibold text-sky-700 mb-4">{cost} pts</p>
                <button
                  disabled={user.points < cost}
                  className={`w-full rounded-full px-5 py-2.5 font-semibold text-sm transition ${
                    user.points >= cost
                      ? "bg-gradient-to-r from-sky-700 to-sky-500 text-white shadow-md hover:from-sky-600 hover:to-sky-400"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  {user.points >= cost ? "Redeem Reward" : "Not enough points"}
                </button>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent to-sky-100/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* ACHIEVEMENTS SECTION */}
        <section className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold text-slate-800 mb-10"
          >
            Recent Achievements
          </motion.h2>

          {achievements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-md rounded-2xl bg-white/80 backdrop-blur-md p-10 shadow-md ring-1 ring-slate-200"
            >
              <p className="text-slate-500 text-base leading-relaxed">
                No achievements yet — start by reporting or returning lost items
                to earn your first UniPoints and unlock rewards!
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-3">
              {achievements.map((a) => (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="rounded-xl bg-white/80 p-5 shadow-sm ring-1 ring-slate-200"
                >
                  <h3 className="font-semibold text-sky-700">{a.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{a.date}</p>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </Container>

      <Footer />
    </main>
  );
}