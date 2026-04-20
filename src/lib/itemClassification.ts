import { getEstimatedPointsForTier, type ItemValueTier } from "@/lib/rewardConfig";

export type ItemClassificationResult = {
  tier: ItemValueTier;
  item_type: string;
  reason: string;
  estimated_points: number;
};

type OpenAIClassification = {
  tier: ItemValueTier;
  item_type: string;
  reason: string;
};

const MODEL = "gpt-4.1-mini";
const FALLBACK_TIER: ItemValueTier = "medium";
const LOW_VALUE_BAG_KEYWORDS = [
  "bag",
  "backpack",
  "schoolbag",
  "school bag",
  "rucksack",
  "tote",
  "tote bag",
  "duffel",
  "duffle",
  "gym bag",
  "lunch bag",
  "book bag",
  "drawstring bag",
  "satchel",
];

function buildPrompt({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl?: string | null;
}) {
  return [
    "You classify found campus items by approximate value tier only.",
    "Choose exactly one tier from: low, medium, high.",
    "Do not assign points.",
    "Consider replacement value, sensitivity, and importance to a student.",
    "HIGH: Laptops, tablets, expensive phones (iPhone/Samsung flagship), premium electronics, gaming devices.",
    "MEDIUM: AirPods Pro/Max, budget phones, Kindle, portable chargers, quality headphones, designer wallets, watches, premium textbooks.",
    "LOW: Backpacks, bags, clothing (even branded), water bottles, notebooks, common accessories, AirPods (standard), earbuds, pens, keys.",
    "Guideline: School bags and backpacks are LOW tier regardless of brand. Premium electronics are MEDIUM+.",
    'Return strict JSON with keys: "tier", "item_type", "reason".',
    `Title: ${title}`,
    `Description: ${description}`,
    imageUrl ? `Image URL: ${imageUrl}` : "Image URL: none provided",
  ].join("\n");
}

function isItemValueTier(value: string): value is ItemValueTier {
  return value === "low" || value === "medium" || value === "high";
}

function parseClassification(raw: string): OpenAIClassification | null {
  try {
    const parsed = JSON.parse(raw) as Partial<OpenAIClassification>;

    if (
      typeof parsed.tier === "string" &&
      isItemValueTier(parsed.tier) &&
      typeof parsed.item_type === "string" &&
      parsed.item_type.trim() &&
      typeof parsed.reason === "string" &&
      parsed.reason.trim()
    ) {
      return {
        tier: parsed.tier,
        item_type: parsed.item_type.trim(),
        reason: parsed.reason.trim(),
      };
    }
  } catch {
    return null;
  }

  return null;
}

function detectDeterministicClassification({
  title,
  description,
}: {
  title: string;
  description: string;
}): ItemClassificationResult | null {
  const combinedText = `${title} ${description}`.toLowerCase();
  const matchedBagKeyword = LOW_VALUE_BAG_KEYWORDS.find((keyword) =>
    combinedText.includes(keyword),
  );

  if (matchedBagKeyword) {
    return {
      tier: "low",
      item_type: "bag",
      reason: `Detected "${matchedBagKeyword}" in the report. Bags and backpacks are treated as low-value campus items even when branded.`,
      estimated_points: getEstimatedPointsForTier("low"),
    };
  }

  return null;
}

function buildFallbackResult(
  title: string,
  description: string,
  fallbackReason: string,
): ItemClassificationResult {
  return {
    tier: FALLBACK_TIER,
    item_type: title.split(" ")[0]?.trim() || "item",
    reason: `${fallbackReason} The item was stored with a conservative medium-value estimate based on the available description: ${description.slice(0, 120)}`,
    estimated_points: getEstimatedPointsForTier(FALLBACK_TIER),
  };
}

export async function classifyItemValue({
  title,
  description,
  imageUrl,
}: {
  title: string;
  description: string;
  imageUrl?: string | null;
}): Promise<ItemClassificationResult> {
  const deterministicClassification = detectDeterministicClassification({
    title,
    description,
  });

  if (deterministicClassification) {
    return deterministicClassification;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackResult(
      title,
      description,
      "OPENAI_API_KEY is not configured.",
    );
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: "You are a careful lost-and-found classifier. Output valid JSON only.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: buildPrompt({ title, description, imageUrl }),
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      return buildFallbackResult(
        title,
        description,
        `OpenAI request failed with status ${response.status}.`,
      );
    }

    const data = (await response.json()) as { output_text?: string };
    const classification = parseClassification(data.output_text ?? "");

    if (!classification) {
      return buildFallbackResult(
        title,
        description,
        "The classifier returned an invalid response.",
      );
    }

    return {
      tier: classification.tier,
      item_type: classification.item_type,
      reason: classification.reason,
      estimated_points: getEstimatedPointsForTier(classification.tier),
    };
  } catch (error) {
    return buildFallbackResult(
      title,
      description,
      error instanceof Error ? error.message : "Unexpected classification error.",
    );
  }
}

