import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Data layer will fallback to empty state.");
}

// Initialize with fallback values to prevent "supabaseUrl is required" error during runtime initialization.
// If valid credentials are provided, they will be used. 
// If not, the client initializes with placeholders so the app loads, but DB calls will fail gracefully in the service layer.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
