import { createClient } from "@supabase/supabase-js";

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || url === "your_supabase_url") return null;
  return createClient(url, key);
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || url === "your_supabase_url") return null;
  if (!serviceKey) {
    console.error("[Supabase] SUPABASE_SERVICE_ROLE_KEY is not set — admin DB writes (payment_status updates etc.) will be skipped");
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const SUPABASE_SETUP_SQL = `
-- Run this in your Supabase SQL editor
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  delivery_info TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_reference TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status TEXT DEFAULT 'new' CHECK (order_status IN ('new', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert" ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role full access" ON orders
  USING (auth.role() = 'service_role');
`;
