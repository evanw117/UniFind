import { NextResponse } from "next/server";
import { classifyItemValue } from "@/lib/itemClassification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      title?: string;
      description?: string;
      image_url?: string;
    };

    const title = body.title?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const imageUrl = body.image_url?.trim();

    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required." },
        { status: 400 },
      );
    }

    const classification = await classifyItemValue({
      title,
      description,
      imageUrl,
    });

    return NextResponse.json(classification);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected classification error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

