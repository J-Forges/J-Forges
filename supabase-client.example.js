// Copy into your frontend build and install @supabase/supabase-js.
// Keep only the URL + anon key here. NEVER put service-role or payment secrets in this file.
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
