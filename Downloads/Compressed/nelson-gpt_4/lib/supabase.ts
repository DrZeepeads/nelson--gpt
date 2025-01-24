import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bcjkwaruwzqntczqvybv.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjamt3YXJ1d3pxbnRjenF2eWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3MDkzOTUsImV4cCI6MjA1MzI4NTM5NX0.x99vZrVv8U4KcjYLduUNVGSSHNdEsV6msg3M1q73nTY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
