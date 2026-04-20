import { createClient } from "@supabase/supabase-js";
import { isValidSupabaseUrl, supabaseAnonKey, supabaseUrl } from "@/lib/supabaseConfig";

// Only create client if we have valid environment variables
export const supabase =
  supabaseUrl && supabaseAnonKey && isValidSupabaseUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
