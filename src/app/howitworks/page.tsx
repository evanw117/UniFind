"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../Footer";
import {
  Upload, Search, Zap, TrendingUp, Star, Award, Gift,
  ChevronDown, CheckCircle, Smartphone, Brain, Shield,
  Users, AlertCircle, Sparkles, ArrowRight, Lock, MapPin
} from "lucide-react";

// ─── STEP SHOWCASES ─────────────────────────────────────────────────────────
const StepShowcase = ({ 
  number, 
  icon: Icon, 
  title, 
  description, 
  delay,
  color 
}: { 
  number: string; 
  icon: any; 
  title: string; 
  description: string; 
  delay: number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 60, rotateX: 90 }}
    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    viewport={{ once: true }}
    className="relative"
  >
    <div className="relative p-8 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-200 transition-all shadow-sm hover:shadow-xl h-full">
      {/* Number badge */}
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay }}
        className={`inline-flex items-center justify-center w-14 h-14 rounded-xl font-bold text-white text-lg mb-6 ${color}`}
      >
        {number}
      </motion.div>

      {/* Icon */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
        className="mb-6"
      >
        <Icon className="w-10 h-10 text-slate-900" strokeWidth={1.5} />
      </motion.div>

      {/* Content */}
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>

      {/* Accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ delay: delay + 0.3, duration: 0.6 }}
        viewport={{ once: true }}
        className={`absolute bottom-0 left-0 h-1 ${color} rounded-r-full`}
        style={{ width: "60%" }}
      />
    </div>
  </motion.div>
);

// ─── ANIMATED BACKGROUND ORBS ───────────────────────────────────────────────
const BackgroundOrb = ({ 
  color, 
  top, 
  left, 
  size, 
  delay 
}: { 
  color: string; 
  top: string; 
  left: string; 
  size: string; 
  delay: number 
}) => (
  <motion.div
    animate={{
      y: [0, 30, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 6 + delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className={`absolute ${size} ${color} rounded-full blur-3xl opacity-30 pointer-events-none`}
    style={{ top, left }}
  />
);

// ─── HERO SECTION ───────────────────────────────────────────────────────────
function HowItWorksHero() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Report Found Items",
      description: "Snap a photo of any lost item you find on campus. Add details and our AI automatically categorizes it for searchability.",
      color: "bg-gradient-to-br from-sky-500 to-sky-600",
    },
    {
      number: "02",
      icon: Users,
      title: "Connect & Reunite",
      description: "Students searching for lost items find your report. Make a direct connection and coordinate the return.",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    },
    {
      number: "03",
      icon: Zap,
      title: "Earn & Reward",
      description: "Get +25 points for each successful return. Climb the tier system and unlock exclusive campus perks and prizes.",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
    },
  ];

  return (
    <section className="relative -mt-24 pt-24 min-h-screen bg-white overflow-hidden">
      {/* Background orbs */}
      <BackgroundOrb color="bg-sky-300" top="10%" left="10%" size="w-72 h-72" delay={0} />
      <BackgroundOrb color="bg-indigo-300" top="50%" left="75%" size="w-96 h-96" delay={0.5} />
      <BackgroundOrb color="bg-amber-300" top="70%" left="5%" size="w-80 h-80" delay={1} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-700 font-semibold text-sm">
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                ✨
              </motion.span>
              How It Works
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900">
              Turn Found Items Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-500">
                Shared Rewards
              </span>
            </h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-1.5 w-24 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full mx-auto"
            />

            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              Help reunite lost belongings with their owners and build a stronger campus community while earning exclusive rewards.
            </p>
          </motion.div>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <StepShowcase
              key={index}
              number={step.number}
              icon={step.icon}
              title={step.title}
              description={step.description}
              delay={index * 0.2}
              color={step.color}
            />
          ))}
        </div>

        {/* Key stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200"
        >
          {[
            { label: "Active Users", value: "1000+" },
            { label: "Items Returned", value: "2500+" },
            { label: "Totally Free", value: "100%" },
            { label: "Reward Tiers", value: "4 Levels" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
              >
                {stat.value}
              </motion.p>
              <p className="text-sm text-slate-600 mt-2 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/campus/select/report"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold text-lg shadow-lg hover:shadow-2xl transition-all border-2 border-sky-400/50"
            >
              <Upload className="w-5 h-5" />
              Start Reporting
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/campus/select/lost"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-slate-100 text-slate-900 font-bold text-lg border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-200 transition-all shadow-md"
            >
              <Search className="w-5 h-5" />
              Search Items
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Brain,
              title: "Smart Search",
              desc: "AI-powered semantic matching finds items even with fuzzy descriptions",
              color: "text-indigo-600",
            },
            {
              icon: Shield,
              title: "Safe & Secure",
              desc: "Verified reports and protected contact details until item is claimed",
              color: "text-emerald-600",
            },
            {
              icon: Award,
              title: "Exclusive Rewards",
              desc: "Tier system with campus vouchers, tech, and premium perks",
              color: "text-amber-600",
            },
          ].map((feature, i) => {
            const FeatureIcon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -30 : i === 2 ? 30 : 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-white/50 backdrop-blur border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                  className={`inline-block p-3 rounded-lg mb-4 ${feature.color.replace("text-", "bg-").replace("600", "100")}`}
                >
                  <FeatureIcon className={`w-6 h-6 ${feature.color}`} />
                </motion.div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-400"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

// ─── 3-STEP OVERVIEW ────────────────────────────────────────────────────────
function ThreeStepOverview() {
  const steps = [
    {
      number: 1,
      title: "Report",
      description: "Found an item? Upload a photo and details—our AI identifies it instantly.",
      icon: Upload,
      color: "from-sky-500 to-blue-600",
      highlights: ["Photo upload", "AI-powered detection", "Instant categorization"],
    },
    {
      number: 2,
      title: "Search",
      description: "Lost something? Our semantic search finds matches even with fuzzy descriptions.",
      icon: Search,
      color: "from-purple-500 to-indigo-600",
      highlights: ["Smart matching", "Campus filter", "Real-time updates"],
    },
    {
      number: 3,
      title: "Earn Rewards",
      description: "Once an item is reunited, collect points and redeem for prizes.",
      icon: Zap,
      color: "from-amber-400 to-orange-500",
      highlights: ["Tier system", "Exclusive perks", "Campus redemption"],
    },
  ];

  return (
    <section className="relative bg-white py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-sky-600 mb-4">The Process</h2>
          <p className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Reuniting in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">3 Simple Steps</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Large background number */}
              <div className="absolute -top-10 -left-6 text-[120px] font-black text-slate-100/60 select-none group-hover:text-sky-50 transition-colors duration-500">
                {step.number}
              </div>

              <div className="relative flex flex-col p-10 rounded-[32px] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 transition-all duration-500 group-hover:-translate-y-3 group-hover:shadow-2xl group-hover:border-sky-100 h-full">
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg mb-8 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110`}>
                  <step.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg mb-6 flex-grow">
                  {step.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  {step.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection dots */}
        <div className="hidden lg:flex justify-center gap-8 mt-16 text-slate-300">
          <ArrowRight className="w-8 h-8 -rotate-45" />
          <ArrowRight className="w-8 h-8 -rotate-45" />
        </div>
      </div>
    </section>
  );
}

// ─── DETAILED FEATURE SECTION ────────────────────────────────────────────────
function FeatureDetails() {
  const features = [
    {
      title: "How Reporting Works",
      icon: Upload,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-100",
      steps: [
        { title: "Choose Campus", desc: "Select ATU Galway or University of Galway" },
        { title: "Upload Photo", desc: "Take or upload a high-quality image of the item" },
        { title: "Add Details", desc: "Fill in title, description, category, and location" },
        { title: "AI Processing", desc: "Our system analyzes and categorizes automatically" },
        { title: "Go Live", desc: "Your report is instantly published for all students to see" },
        { title: "Earn Points", desc: "+10 reward points for reporting" },
      ],
      reward: "+10 pts",
    },
    {
      title: "AI Reward Points System",
      icon: Brain,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      steps: [
        { title: "Image Analysis", desc: "Our AI analyzes photos to assess item condition and value" },
        { title: "Description Processing", desc: "AI processes your text to understand item details and category" },
        { title: "Value Classification", desc: "System automatically classifies items as low, medium, or high value" },
        { title: "Point Calculation", desc: "Reward points are calculated based on item value tier and action type" },
        { title: "Multiplier Application", desc: "High-value returns earn up to 2.2x multiplier for extra rewards" },
        { title: "Anti-Fraud Detection", desc: "Advanced checks prevent suspicious patterns and ensure fair rewards" },
      ],
      reward: "Earn rewards",
    },
    {
      title: "Secure & Protected",
      icon: Shield,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      steps: [
        { title: "Verified Database", desc: "All items go through basic verification" },
        { title: "Contact Moderation", desc: "Direct contact details protected until claim" },
        { title: "Audit Trail", desc: "Full history of all item reports and claims" },
        { title: "User Ratings", desc: "Build community trust through reviews" },
        { title: "Report System", desc: "Flag suspicious or inappropriate items" },
        { title: "Data Privacy", desc: "Your information stays secure and private" },
      ],
      reward: "Peace of mind",
    },
  ];

  const [expandedFeature, setExpandedFeature] = useState<number>(0);

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">Detailed Features</h2>
          <p className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Understanding the Platform
          </p>
        </motion.div>

        <div className="space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isOpen = expandedFeature === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                  isOpen ? `${feature.border} ${feature.bg}` : "border-slate-200 bg-white"
                }`}
              >
                {/* Header Button */}
                <button
                  onClick={() => setExpandedFeature(isOpen ? -1 : index)}
                  className="w-full p-6 flex items-center gap-4 text-left hover:bg-black/2 transition-colors"
                >
                  <div className={`p-3 rounded-xl ${feature.bg} flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-6 h-6 ${feature.color}`} />
                  </motion.div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2 border-t-2 border-slate-200/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {feature.steps.map((step, stepIndex) => (
                            <motion.div
                              key={stepIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stepIndex * 0.05 }}
                              className="flex gap-3 p-3 rounded-lg bg-white/50"
                            >
                              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-200/50 text-xs font-bold text-slate-700">
                                {stepIndex + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                                <p className="text-xs text-slate-600 mt-1">{step.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <p className="text-sm font-semibold text-slate-800">
                            <span className="text-amber-600">{feature.reward}</span> - Start engaging with UniFind today!
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── REWARDS TIER EXPLANATION ────────────────────────────────────────────────
function RewardsExplanation() {
  const tiers = [
    {
      name: "Bronze",
      emoji: "🥉",
      minPts: 0,
      color: "#c8956a",
      bg: "#fdf0e6",
      benefits: ["Free coffee voucher", "SU shop access", "Campus event tickets"],
      description: "Entry level tier for new members",
    },
    {
      name: "Silver",
      emoji: "🥈",
      minPts: 100,
      color: "#5a8fa0",
      bg: "#eaf4f9",
      benefits: ["Campus event tickets", "€10 SU voucher", "Café loyalty card"],
      description: "Growing contributor status",
    },
    {
      name: "Gold",
      emoji: "🥇",
      minPts: 300,
      color: "#d4900a",
      bg: "#fdf8ec",
      benefits: ["Wireless earbuds", "€25 Amazon voucher", "UniFind hoodie"],
      description: "Highly active member",
    },
    {
      name: "Platinum",
      emoji: "💎",
      minPts: 600,
      color: "#4B7C9B",
      bg: "#e6f1fb",
      benefits: ["€50 campus voucher", "Priority support", "Premium tech bundle"],
      description: "Elite champion status",
    },
  ];

  return (
    <section className="relative bg-white py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-amber-600 mb-4">Rewards System</h2>
          <p className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Earn, Climb, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Redeem Rewards</span>
          </p>
        </motion.div>

        {/* How to Earn */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-16 p-8 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-100"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-600" /> How to Earn Points
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { action: "Report Lost Item", pts: "+10", icon: Upload },
              { action: "Return Found Item", pts: "+25", icon: CheckCircle },
              { action: "First Login", pts: "+5", icon: Sparkles },
              { action: "Weekly Active", pts: "+15", icon: TrendingUp },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 rounded-xl bg-white/80 backdrop-blur border border-amber-200 shadow-sm text-center"
                >
                  <ItemIcon className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-900">{item.action}</p>
                  <p className="text-lg font-bold text-amber-600 mt-1">{item.pts}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl overflow-hidden shadow-lg border-2 transition-all"
              style={{
                background: tier.bg,
                borderColor: tier.color,
              }}
            >
              {/* Header bar */}
              <div className="h-3 w-full" style={{ background: tier.color }} />

              <div className="p-6">
                {/* Emoji and name */}
                <div className="text-4xl mb-2">{tier.emoji}</div>
                <h3 className="text-2xl font-bold text-slate-900">{tier.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{tier.description}</p>

                {/* Points requirement */}
                <div className="mt-4 p-3 rounded-lg bg-white/60 backdrop-blur border border-black/10">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Points Required</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{tier.minPts}+ pts</p>
                </div>

                {/* Benefits */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tier Benefits</p>
                  {tier.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <Gift className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: tier.color }} />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Unlock tag */}
                {tier.minPts > 0 && (
                  <div className="mt-4 p-2 rounded-lg bg-black/5 border border-black/10 text-center">
                    <p className="text-xs font-bold text-slate-600">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Unlock at {tier.minPts} points
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── JOURNEY TIMELINE ────────────────────────────────────────────────────────
function JourneyTimeline() {
  const events = [
    {
      order: 1,
      title: "You Find an Item",
      desc: "Discover something on campus that doesn't belong to you",
      time: "Day 1",
      icon: AlertCircle,
      color: "text-red-500",
    },
    {
      order: 2,
      title: "Report to UniFind",
      desc: "Upload a clear photo and add item details",
      time: "Day 1",
      icon: Upload,
      color: "text-sky-500",
      reward: "+10 pts",
    },
    {
      order: 3,
      title: "Student Searches",
      desc: "The lost item owner searches and finds your report",
      time: "Days 1-7",
      icon: Search,
      color: "text-purple-500",
    },
    {
      order: 4,
      title: "They Contact You",
      desc: "Via UniFind contact system to verify and claim",
      time: "Days 2-7",
      icon: Users,
      color: "text-indigo-500",
    },
    {
      order: 5,
      title: "Item Returned",
      desc: "Reunite the item with its rightful owner",
      time: "Days 3-14",
      icon: CheckCircle,
      color: "text-emerald-500",
    },
    {
      order: 6,
      title: "Earn Rewards",
      desc: "Collect your reward points and climb the tier system",
      time: "Day 14",
      icon: Zap,
      color: "text-amber-500",
      reward: "+25 pts",
    },
    {
      order: 7,
      title: "Redeem Prizes",
      desc: "Use points to unlock exclusive campus rewards",
      time: "Any Time",
      icon: Gift,
      color: "text-green-500",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">Your Journey</h2>
          <p className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            From Finding to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">Earning Rewards</span>
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-300/90" />

          <div className="space-y-8">
            {events.map((event, index) => {
              const Icon = event.icon;
              const isActive = index === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="relative pl-16"
                >
                  <div className="absolute left-0 top-3 flex h-12 w-12 items-center justify-center">
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 ${isActive ? "border-red-400 bg-red-500" : "border-slate-300 bg-white"}`}>
                      <Icon className={isActive ? "w-5 h-5 text-white" : "w-5 h-5 text-slate-500"} strokeWidth={2} />
                      {!isActive && (
                        <span className="absolute inset-0 rounded-full bg-slate-200 opacity-40" />
                      )}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ y: -2, scale: 1.01 }}
                    className={`group overflow-hidden rounded-[28px] border ${isActive ? "border-red-200 bg-red-50/80 shadow-[0_24px_80px_-50px_rgba(244,63,94,0.45)]" : "border-slate-200 bg-white shadow-sm"} transition-all duration-300`}
                  >
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div>
                          <p className={`text-base font-semibold ${isActive ? "text-red-700" : "text-slate-900"}`}>
                            {event.title}
                          </p>
                        </div>
                        {event.reward && (
                          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            <Sparkles className="w-3 h-3" />
                            {event.reward}
                          </div>
                        )}
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{event.desc}</p>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ SECTION ────────────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is UniFind free to use?",
      answer:
        "Yes! UniFind is completely free for all students at ATU Galway and University of Galway. Reporting items, searching for lost items, and claiming rewards are all free.",
    },
    {
      question: "How long does it take to earn points?",
      answer:
        "You earn points immediately when you report an item (+10 pts). You can earn +25 pts when an item is successfully returned. Points are displayed in your dashboard right away.",
    },
    {
      question: "Can I redeem my points anywhere?",
      answer:
        "Rewards can be redeemed at participating campus venues including SU shops, cafés, and partner retailers. Each tier unlocks different redemption options.",
    },
    {
      question: "What happens if I report an item and no one claims it?",
      answer:
        "No worries! You keep your points regardless. The item report stays live on UniFind, and someone may find it later. You've done your part in helping the community.",
    },
    {
      question: "Is my personal information safe on UniFind?",
      answer:
        "Absolutely. Your contact details are only shared when someone claims an item. We use industry-standard security and never share your data with third parties.",
    },
    {
      question: "Can I report items for other people?",
      answer:
        "You can report any found item to help reunite it with its owner. If a friend lost something, they can search for it themselves or you can help them search.",
    },
  ];

  return (
    <section className="relative bg-white py-24">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-slate-600 mb-4">FAQ</h2>
          <p className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Questions</span>
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-2xl border-2 border-slate-200 overflow-hidden transition-all hover:border-sky-200 hover:shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-slate-900">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-slate-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t-2 border-slate-100 text-slate-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ────────────────────────────────────────────────────────────
function CallToAction() {
  return (
    <section className="relative bg-gradient-to-r from-slate-900 to-slate-800 py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Ready to Join UniFind?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Start reuniting lost items with their owners today and earn rewards while helping your campus community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/campus/select/report"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#F5B700] text-slate-900 font-bold text-lg shadow-2xl hover:brightness-110 transition-all hover:scale-105 active:scale-95"
            >
              Report Found Item
              <Upload className="w-5 h-5" />
            </Link>
            <Link
              href="/campus/select/lost"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/20 text-white font-bold text-lg border-2 border-white/40 hover:bg-white/30 transition-all"
            >
              Search Lost Items
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <div className="bg-white">
      <HowItWorksHero />
      <ThreeStepOverview />
      <FeatureDetails />
      <RewardsExplanation />
      <JourneyTimeline />
      <FAQ />
      <CallToAction />
      <Footer />
    </div>
  );
}
