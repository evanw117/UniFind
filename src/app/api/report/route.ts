export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const campus = formData.get("campus")?.toString();
    const status = formData.get("status")?.toString(); // "lost" or "found"
    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const category = formData.get("category")?.toString();
    const dateFound = formData.get("dateFound")?.toString();
    const location = formData.get("location")?.toString();
    const contactName = formData.get("contactName")?.toString();
    const contactEmail = formData.get("contactEmail")?.toString();
    const imageFile = formData.get("image") as File | null;

    // Validation
    if (!campus || !status || !title || !description || !category || !dateFound || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert status (lost/found) → boolean
    const statusBool = status === "found";

    let imageUrl = null;

    // Upload image if selected
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name}`;
      const arrayBuffer = await imageFile.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, fileBuffer, {
          contentType: imageFile.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Use the environment variable for the URL base
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      imageUrl = `${supabaseUrl}/storage/v1/object/public/images/${fileName}`;
    }

    // Insert into correct table with correct columns
    const { error } = await supabase.from("lost_and_found_items").insert([
      {
        campus_slug: campus,
        status: statusBool,               // BOOLEAN (true = found, false = lost)
        title,
        description,
        category,
        location,
        date_reported: dateFound,         // Your column name is date_reported
        contact_name: contactName,
        contact_email: contactEmail,
        image_url: imageUrl,
      },
    ]);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}
