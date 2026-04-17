export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { classifyItemValue } from "@/lib/itemClassification";
import { calculateAwardPoints } from "@/lib/rewardConfig";
import { createServerSupabaseClient } from "@/lib/serverSupabase";

const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
  "Lost and found images";

type VerifiedUser = {
  id: string;
  email?: string | null;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const maybeMessage = "message" in error ? error.message : null;
    const maybeDetails = "details" in error ? error.details : null;
    const maybeHint = "hint" in error ? error.hint : null;
    const maybeCode = "code" in error ? error.code : null;

    return [
      typeof maybeMessage === "string" ? maybeMessage : null,
      typeof maybeDetails === "string" ? maybeDetails : null,
      typeof maybeHint === "string" ? `Hint: ${maybeHint}` : null,
      typeof maybeCode === "string" ? `Code: ${maybeCode}` : null,
    ]
      .filter(Boolean)
      .join(" | ") || "Unknown server error.";
  }

  return "Unknown server error.";
}

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

async function awardReportPoints(user: VerifiedUser | null): Promise<number> {
  if (!supabase || !user) {
    return 0;
  }

  const awardPoints = calculateAwardPoints("report");
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("points")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    throw selectError;
  }

  if (existingUser) {
    const { error: updateError } = await supabase
      .from("users")
      .update({ points: (existingUser.points ?? 0) + awardPoints })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    return awardPoints;
  }

  const { error: insertError } = await supabase.from("users").insert([
    {
      id: user.id,
      points: awardPoints,
    },
  ]);

  if (insertError) {
    throw insertError;
  }

  return awardPoints;
}

export async function POST(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Database connection not available. Please check your environment configuration.",
        },
        { status: 500 },
      );
    }

    const formData = await req.formData();

    const campus = formData.get("campus")?.toString();
    const status = formData.get("status")?.toString();
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const category = formData.get("category")?.toString();
    const dateFound = formData.get("dateFound")?.toString();
    const location = formData.get("location")?.toString();
    const contactName = formData.get("contactName")?.toString();
    const contactEmail = formData.get("contactEmail")?.toString();
    const accessToken = formData.get("accessToken")?.toString() ?? null;
    const imageFile = formData.get("image") as File | null;
    const authedSupabase = accessToken ? createServerSupabaseClient(accessToken) : null;
    const insertClient = authedSupabase ?? supabase;

    if (!campus || !status || !title || !description || !category || !dateFound || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isFoundItem = status === "found";
    const verifiedUser = await verifyAccessToken(accessToken);
    let imageUrl: string | null = null;
    let imageUploadWarning: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const arrayBuffer = await imageFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, fileBuffer, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) {
        imageUploadWarning = `Image upload failed for bucket "${STORAGE_BUCKET}": ${uploadError.message}`;
      } else {
        const {
          data: { publicUrl },
        } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const classification = isFoundItem
      ? await classifyItemValue({
          title,
          description,
          imageUrl,
        })
      : null;

    const storedStatus = status === "lost";

    const { error: insertError } = await insertClient.from("lost_and_found_items").insert([
      {
        campus_slug: campus,
        status: storedStatus,
        title,
        description,
        category,
        location,
        date_reported: dateFound,
        contact_name: contactName,
        contact_email: contactEmail,
        image_url: imageUrl,
        reporter_user_id: verifiedUser?.id ?? null,
        item_value_tier: classification?.tier ?? null,
        estimated_points: classification?.estimated_points ?? null,
        classification_reason: classification?.reason ?? null,
      },
    ]);

    if (insertError) {
      throw insertError;
    }

    let awardedPoints = 0;
    let pointsWarning: string | null = null;

    if (isFoundItem && verifiedUser && authedSupabase) {
      const awardPoints = calculateAwardPoints("report");
      const { data: existingUser, error: selectError } = await authedSupabase
        .from("users")
        .select("points")
        .eq("id", verifiedUser.id)
        .maybeSingle();

      if (selectError) {
        pointsWarning = `Reward points could not be updated: ${selectError.message}`;
      } else if (existingUser) {
        const { error: updateError } = await authedSupabase
          .from("users")
          .update({ points: (existingUser.points ?? 0) + awardPoints })
          .eq("id", verifiedUser.id);

        if (updateError) {
          pointsWarning = `Reward points could not be updated: ${updateError.message}`;
        } else {
          awardedPoints = awardPoints;
        }
      } else {
        const { error: insertUserError } = await authedSupabase.from("users").insert([
          {
            id: verifiedUser.id,
            points: awardPoints,
          },
        ]);

        if (insertUserError) {
          pointsWarning = `Reward points could not be updated: ${insertUserError.message}`;
        } else {
          awardedPoints = awardPoints;
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        awarded_points: awardedPoints,
        estimated_return_points: classification?.estimated_points ?? null,
        item_value_tier: classification?.tier ?? null,
        classification_reason: classification?.reason ?? null,
        warning: imageUploadWarning ?? pointsWarning,
        image_upload_warning: imageUploadWarning,
        points_warning: pointsWarning,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = getErrorMessage(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
