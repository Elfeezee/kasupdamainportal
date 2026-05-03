
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStructure() {
  const tables = [
    'users', 'applications', 'transactions', 'payments', 'contact_messages', 
    'news_items', 'publications', 'site_statistics', 'site_events', 
    'site_leadership', 'site_carousel', 'site_mda_logos'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.error(`Error checking ${table}:`, error.message);
      continue;
    }
    if (data && data.length > 0) {
      console.log(`Table ${table} sample:`, Object.keys(data[0]).map(k => `${k}: ${typeof data[0][k]} (${data[0][k]})`).join(', '));
    } else {
      console.log(`Table ${table} is empty.`);
    }
  }
}

checkStructure().catch(console.error);
