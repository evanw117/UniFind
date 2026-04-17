export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { resolveAwardPoints, type ItemValueTier } from "@/lib/rewardConfig";
import { createAdminSupabaseClient } from "@/lib/adminSupabase";

type VerifiedUser = {
  id: string;
  email?: string | null;
};

type ReturnableItem = {
  id: string;
  status: boolean;
  reporter_user_id: string | null;
  item_value_tier: ItemValueTier | null;
  estimated_points: number | null;
  returned_at: string | null;
  owner_claim_user_id: string | null;
  owner_confirmed_at: string | null;
  return_points_awarded: number | null;
  reward_review_status: string | null;
  reward_review_reason: string | null;
};

async function verifyAccessToken(accessToken: string | null): Promise<VerifiedUser | null> {
  if (!supabase || !accessToken) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email,
  };
}

async function addPointsToUser(userId: string, pointsToAdd: number) {
  const adminSupabase = createAdminSupabaseClient();

  if (!adminSupabase) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to award secure return points.");
  }

  const { data: existingUser, error: selectError } = await adminSupabase
    .from("users")
    .select("points")
    .eq("id", userId)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existingUser) {
    const { error: updateError } = await adminSupabase
      .from("users")
      .update({ points: (existingUser.points ?? 0) + pointsToAdd })
      .eq("id", userId);

    if (updateError) {
      throw updateError;
    }

    return;
  }

  const { error: insertError } = await adminSupabase.from("users").insert([
    {
      id: userId,
      points: pointsToAdd,
    },
  ]);

  if (insertError) {
    throw insertError;
  }
}

function buildRewardReview({
  itemValueTier,
  repeatedPairCount,
}: {
  itemValueTier: ItemValueTier | null;
  repeatedPairCount: number;
}) {
  const reasons: string[] = [];

  if (itemValueTier === "high") {
    reasons.push("High-value returns require manual review before finder rewards are released.");
  }

  if (repeatedPairCount >= 2) {
    reasons.push("Repeated returns between the same two accounts were detected in the last 30 days.");
  }

  return {
    shouldHoldReward: reasons.length > 0,
    reviewStatus: reasons.length > 0 ? "pending_review" : "approved",
    reviewReason: reasons.join(" "),
  };
}

export async function POST(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Database connection unavailable." }, { status: 500 });
    }

    const body = (await req.json()) as {
      itemId?: string;
      accessToken?: string;
    };

    const itemId = body.itemId?.trim();
    const accessToken = body.accessToken?.trim() ?? null;
    const adminSupabase = createAdminSupabaseClient();

    if (!itemId) {
      return NextResponse.json({ error: "itemId is required." }, { status: 400 });
    }

    const verifiedUser = await verifyAccessToken(accessToken);

    if (!verifiedUser) {
      return NextResponse.json({ error: "You must be signed in to confirm a return." }, { status: 401 });
    }

    if (!adminSupabase) {
      return NextResponse.json(
        { error: "Server rewards admin client is not configured. Add SUPABASE_SERVICE_ROLE_KEY." },
        { status: 500 },
      );
    }

    const { data: item, error: itemError } = await supabase
      .from("lost_and_found_items")
      .select("id, status, reporter_user_id, item_value_tier, estimated_points, returned_at, owner_claim_user_id, owner_confirmed_at, return_points_awarded, reward_review_status, reward_review_reason")
      .eq("id", itemId)
      .maybeSingle();

    if (itemError) {
      throw itemError;
    }

    if (!item) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }

    const returnableItem = item as ReturnableItem;

    if (returnableItem.status !== false) {
      return NextResponse.json(
        { error: "Only found-item reports can be marked as returned." },
        { status: 400 },
      );
    }

    if (!returnableItem.reporter_user_id) {
      return NextResponse.json(
        { error: "This report does not have a finder attached, so receipt cannot be confirmed yet." },
        { status: 400 },
      );
    }

    if (returnableItem.reporter_user_id === verifiedUser.id) {
      return NextResponse.json(
        { error: "Finders cannot confirm receipt of their own item. The owner must confirm it." },
        { status: 403 },
      );
    }

    if (returnableItem.owner_confirmed_at) {
      return NextResponse.json(
        {
          success: true,
          awarded_points: returnableItem.return_points_awarded ?? 0,
          already_confirmed: true,
          reward_review_status: returnableItem.reward_review_status ?? "approved",
          reward_review_reason: returnableItem.reward_review_reason,
        },
        { status: 200 },
      );
    }

    const baseAwardedPoints = resolveAwardPoints({
      action: "return",
      itemValueTier: returnableItem.item_value_tier,
      estimatedPoints: returnableItem.estimated_points,
    });

    const returnedAt = new Date().toISOString();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { count: repeatedPairCount, error: pairError } = await adminSupabase
      .from("lost_and_found_items")
      .select("id", { count: "exact", head: true })
      .eq("reporter_user_id", returnableItem.reporter_user_id)
      .eq("owner_claim_user_id", verifiedUser.id)
      .gte("owner_confirmed_at", thirtyDaysAgo);

    if (pairError) {
      throw pairError;
    }

    const review = buildRewardReview({
      itemValueTier: returnableItem.item_value_tier,
      repeatedPairCount: repeatedPairCount ?? 0,
    });
    const awardedPoints = review.shouldHoldReward ? 0 : baseAwardedPoints;

    const { error: updateItemError } = await adminSupabase
      .from("lost_and_found_items")
      .update({
        returned_at: returnedAt,
        returned_by_user_id: verifiedUser.id,
        owner_claim_user_id: verifiedUser.id,
        owner_confirmed_at: returnedAt,
        return_points_awarded: awardedPoints,
        reward_review_status: review.reviewStatus,
        reward_review_reason: review.reviewReason || null,
      })
      .eq("id", itemId);

    if (updateItemError) {
      throw updateItemError;
    }

    if (!review.shouldHoldReward) {
      await addPointsToUser(returnableItem.reporter_user_id, awardedPoints);
    }

    return NextResponse.json(
      {
        success: true,
        awarded_points: awardedPoints,
        already_confirmed: false,
        reward_review_status: review.reviewStatus,
        reward_review_reason: review.reviewReason || null,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm return.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
