export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { createServerSupabaseClient } from "@/lib/serverSupabase";
import { calculateAwardPoints } from "@/lib/rewardConfig";

type VerifiedUser = {
  id: string;
};

type DeletableReport = {
  id: string;
  status: boolean;
  reporter_user_id: string | null;
  return_points_awarded: number | null;
};

function calculatePointsFromReports(reports: Array<Pick<DeletableReport, "status" | "return_points_awarded">>) {
  return reports.reduce((total, report) => {
    const reportPoints = report.status === false ? calculateAwardPoints("report") : 0;
    const returnPoints = report.status === false ? Math.max(0, report.return_points_awarded ?? 0) : 0;
    return total + reportPoints + returnPoints;
  }, 0);
}

type RouteContext = {
  params: Promise<{
    reportId: string;
  }>;
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
  };
}

export async function DELETE(req: Request, context: RouteContext) {
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

    const { reportId } = await context.params;
    const body = (await req.json().catch(() => ({}))) as { accessToken?: string };
    const accessToken = body.accessToken?.trim() ?? null;
    const verifiedUser = await verifyAccessToken(accessToken);

    if (!verifiedUser) {
      return NextResponse.json({ error: "You must be signed in to delete a report." }, { status: 401 });
    }

    if (!reportId) {
      return NextResponse.json({ error: "Missing report id." }, { status: 400 });
    }

    const authedSupabase = createServerSupabaseClient(accessToken);
    const { data: report, error: reportError } = await authedSupabase
      .from("lost_and_found_items")
      .select("id, status, reporter_user_id, return_points_awarded")
      .eq("id", reportId)
      .eq("reporter_user_id", verifiedUser.id)
      .maybeSingle();

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 });
    }

    if (!report) {
      return NextResponse.json(
        {
          error:
            "Delete was blocked by your Supabase permissions. Re-run the delete policy in supabase_setup.sql, then try again.",
        },
        { status: 403 },
      );
    }

    const { data: deletedReports, error: deleteError } = await authedSupabase
      .from("lost_and_found_items")
      .delete()
      .eq("id", reportId)
      .eq("reporter_user_id", verifiedUser.id)
      .select("id");

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (!deletedReports || deletedReports.length === 0) {
      return NextResponse.json(
        {
          error:
            "Delete was blocked by your Supabase permissions. Re-run the delete policy in supabase_setup.sql, then try again.",
        },
        { status: 403 },
      );
    }

    const { data: remainingReports, error: remainingReportsError } = await authedSupabase
      .from("lost_and_found_items")
      .select("status, return_points_awarded")
      .eq("reporter_user_id", verifiedUser.id);

    if (remainingReportsError) {
      return NextResponse.json(
        {
          error: `The report was deleted, but reward points could not be recalculated: ${remainingReportsError.message}`,
        },
        { status: 500 },
      );
    }

    const recalculatedPoints = calculatePointsFromReports(
      ((remainingReports as Array<Pick<DeletableReport, "status" | "return_points_awarded">> | null) ?? []),
    );

    const { data: userRow, error: userError } = await authedSupabase
      .from("users")
      .select("id")
      .eq("id", verifiedUser.id)
      .maybeSingle();

    if (userError) {
      return NextResponse.json(
        {
          error: `The report was deleted, but reward points could not be updated: ${userError.message}`,
        },
        { status: 500 },
      );
    }

    if (userRow) {
      const { error: updateUserError } = await authedSupabase
        .from("users")
        .update({ points: recalculatedPoints })
        .eq("id", verifiedUser.id);

      if (updateUserError) {
        return NextResponse.json(
          {
            error: `The report was deleted, but reward points could not be updated: ${updateUserError.message}`,
          },
          { status: 500 },
        );
      }
    } else {
      const { error: insertUserError } = await authedSupabase.from("users").insert([
        {
          id: verifiedUser.id,
          points: recalculatedPoints,
        },
      ]);

      if (insertUserError) {
        return NextResponse.json(
          {
            error: `The report was deleted, but reward points could not be updated: ${insertUserError.message}`,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      deletedId: deletedReports[0].id,
      recalculated_points: recalculatedPoints,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
