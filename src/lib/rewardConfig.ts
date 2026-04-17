export type ItemValueTier = "low" | "medium" | "high";
export type RewardTierName = "Bronze" | "Silver" | "Gold" | "Platinum";
export type RewardAction = "report" | "return";

export type RewardCatalogItem = {
  id: string;
  title: string;
  description: string;
  cost: number;
  tier: RewardTierName;
  iconKey:
    | "coffee"
    | "book"
    | "shirt"
    | "ticket"
    | "bag"
    | "headphones"
    | "gift"
    | "star";
};

export type RewardTierConfig = {
  name: RewardTierName;
  emoji: string;
  minPts: number;
  color: string;
  bg: string;
  border: string;
};

export const REPORT_POINTS = 10;
export const RETURN_POINTS = 22;

export const VALUE_TIER_CONFIG: Record<
  ItemValueTier,
  {
    label: string;
    multiplier: number;
    estimatedReturnPoints: number;
  }
> = {
  low: {
    label: "Low value",
    multiplier: 1,
    estimatedReturnPoints: 22,
  },
  medium: {
    label: "Medium value",
    multiplier: 1.7,
    estimatedReturnPoints: 38,
  },
  high: {
    label: "High value",
    multiplier: 2.2,
    estimatedReturnPoints: 55,
  },
};

export const REWARD_TIERS: RewardTierConfig[] = [
  {
    name: "Bronze",
    emoji: "🥉",
    minPts: 0,
    color: "#c8956a",
    bg: "#fdf0e6",
    border: "#f0c9a0",
  },
  {
    name: "Silver",
    emoji: "🥈",
    minPts: 80,
    color: "#5a8fa0",
    bg: "#eaf4f9",
    border: "#b0d4e4",
  },
  {
    name: "Gold",
    emoji: "🥇",
    minPts: 180,
    color: "#d4900a",
    bg: "#fdf8ec",
    border: "#f0d98a",
  },
  {
    name: "Platinum",
    emoji: "💎",
    minPts: 320,
    color: "#4B7C9B",
    bg: "#e6f1fb",
    border: "#a8ccdf",
  },
];

export const REWARD_CATALOG: RewardCatalogItem[] = [
  {
    id: "free-coffee-voucher",
    title: "Free Coffee Voucher",
    cost: 35,
    description: "A free coffee at your campus cafe.",
    tier: "Bronze",
    iconKey: "coffee",
  },
  {
    id: "refill-pad",
    title: "Refill Pad",
    cost: 55,
    description: "A refill pad from the student union shop.",
    tier: "Bronze",
    iconKey: "book",
  },
  {
    id: "college-tshirt",
    title: "College T-Shirt",
    cost: 80,
    description: "An official student college T-shirt.",
    tier: "Bronze",
    iconKey: "shirt",
  },
  {
    id: "campus-event-ticket",
    title: "Campus Event Ticket",
    cost: 110,
    description: "Free entry to a campus society event or student night.",
    tier: "Silver",
    iconKey: "ticket",
  },
  {
    id: "student-lunch-voucher",
    title: "Student Lunch Voucher",
    cost: 130,
    description: "EUR8 off a lunch combo in a participating campus cafe.",
    tier: "Silver",
    iconKey: "bag",
  },
  {
    id: "cafe-loyalty-card",
    title: "Cafe Loyalty Card",
    cost: 150,
    description: "A 5-stamp loyalty card for the campus cafe.",
    tier: "Silver",
    iconKey: "coffee",
  },
  {
    id: "bookshop-voucher",
    title: "Bookshop Voucher",
    cost: 210,
    description: "EUR12 towards stationery, books, or course supplies.",
    tier: "Gold",
    iconKey: "gift",
  },
  {
    id: "unifind-hoodie",
    title: "UniFind Hoodie",
    cost: 240,
    description: "A premium UniFind hoodie in your size.",
    tier: "Gold",
    iconKey: "star",
  },
  {
    id: "portable-charger",
    title: "Portable Charger",
    cost: 280,
    description: "A compact power bank for long campus days.",
    tier: "Gold",
    iconKey: "headphones",
  },
  {
    id: "campus-voucher",
    title: "EUR25 Campus Voucher",
    cost: 340,
    description: "EUR25 voucher valid across selected campus shops and cafes.",
    tier: "Platinum",
    iconKey: "gift",
  },
  {
    id: "semester-print-credit",
    title: "Semester Print Credit",
    cost: 390,
    description: "A larger campus print allowance for notes and assignments.",
    tier: "Platinum",
    iconKey: "book",
  },
  {
    id: "study-essentials-bundle",
    title: "Study Essentials Bundle",
    cost: 450,
    description: "A practical bundle with stationery, tote bag, and cafe credit.",
    tier: "Platinum",
    iconKey: "bag",
  },
];

export function isItemValueTier(value: string): value is ItemValueTier {
  return value === "low" || value === "medium" || value === "high";
}

export function getEstimatedPointsForTier(tier: ItemValueTier): number {
  return VALUE_TIER_CONFIG[tier].estimatedReturnPoints;
}

export function calculateAwardPoints(
  action: RewardAction,
  tier?: ItemValueTier | null,
): number {
  if (action === "report") {
    return REPORT_POINTS;
  }

  if (!tier) {
    return RETURN_POINTS;
  }

  return getEstimatedPointsForTier(tier);
}

export function resolveAwardPoints({
  action,
  itemValueTier,
  estimatedPoints,
}: {
  action: RewardAction;
  itemValueTier?: ItemValueTier | null;
  estimatedPoints?: number | null;
}): number {
  if (action === "report") {
    return REPORT_POINTS;
  }

  if (itemValueTier) {
    return calculateAwardPoints("return", itemValueTier);
  }

  if (typeof estimatedPoints === "number" && Number.isFinite(estimatedPoints)) {
    return Math.max(0, Math.round(estimatedPoints));
  }

  return RETURN_POINTS;
}

export function getCurrentTier(points: number): RewardTierConfig {
  return [...REWARD_TIERS].reverse().find((tier) => points >= tier.minPts) ?? REWARD_TIERS[0];
}

export function getNextTier(points: number): RewardTierConfig | null {
  return REWARD_TIERS.find((tier) => tier.minPts > points) ?? null;
}

export function getRewardsByTier(tier: RewardTierName): RewardCatalogItem[] {
  return REWARD_CATALOG.filter((reward) => reward.tier === tier);
}
