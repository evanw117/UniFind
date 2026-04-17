import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const env = fs.readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim();

if (!url || !key) {
  throw new Error("Missing Supabase environment variables in .env.local");
}

const supabase = createClient(url, key);

async function run() {
  const { data: latestItems, error: itemError } = await supabase
    .from("lost_and_found_items")
    .select(
      "id, created_at, title, campus_slug, status, reporter_user_id, item_value_tier, estimated_points, returned_at, return_points_awarded",
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: userRows, error: usersError } = await supabase
    .from("users")
    .select("*")
    .limit(10);

  console.log("\n=== Latest lost_and_found_items ===");
  if (itemError) {
    console.log(itemError);
  } else {
    console.table(latestItems ?? []);
  }

  console.log("\n=== users table ===");
  if (usersError) {
    console.log(usersError);
  } else {
    console.table(userRows ?? []);
  }
}

await run();
