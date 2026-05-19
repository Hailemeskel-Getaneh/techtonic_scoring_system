/**
 * Supabase Client Initialization
 * 
 * IMPORTANT: Replace these placeholders with your actual Supabase Project URL and Anon Key.
 * You can find these in your Supabase Dashboard under Settings > API.
 */

const supabaseUrl = 'https://fsvrljozojfzqomxcryc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzdnJsam96b2pmenFvbXhjcnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTU1NzgsImV4cCI6MjA5NDc3MTU3OH0.yzsj28JddNBHroh0T-1dDUwrv57-ay3D7aznEozRIdM';

// Initialize the Supabase client
// Using window.supabase because it's loaded via CDN in index.html
let supabase;

try {
    if (supabaseUrl !== 'YOUR_SUPABASE_URL_HERE') {
        supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    } else {
        console.warn("Supabase credentials not set! App will use mock data or fail.");
    }
} catch (e) {
    console.error("Failed to initialize Supabase client:", e);
}

export { supabase };
