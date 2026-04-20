const FALLBACK_SUPABASE_URL = "https://kptvpooyqhywptolzdwf.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdHZwb295cWh5d3B0b2x6ZHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzA4NTcsImV4cCI6MjA3ODYwNjg1N30.DvQqN5HKJKykWuNC_VoBhL_1Q2KtmjUXX7JggRJH2hY";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

export function isValidSupabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
