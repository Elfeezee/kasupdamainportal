import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../lib/db/schema';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'kasupda_user',
    password: process.env.DB_PASSWORD || 'kasupda_pass',
    database: process.env.DB_NAME || 'postgres',
  });

  const db = drizzle(connection, { schema, mode: 'default' });

  const tables = [
    { name: 'users', drizzleTable: schema.users },
    { name: 'applications', drizzleTable: schema.applications },
    { name: 'transactions', drizzleTable: schema.transactions },
    { name: 'payments', drizzleTable: schema.payments },
    { name: 'contact_messages', drizzleTable: schema.contact_messages },
    { name: 'news_items', drizzleTable: schema.news_items },
    { name: 'publications', drizzleTable: schema.publications },
    { name: 'site_statistics', drizzleTable: schema.site_statistics },
    { name: 'site_events', drizzleTable: schema.site_events },
    { name: 'site_leadership', drizzleTable: schema.site_leadership },
    { name: 'site_carousel', drizzleTable: schema.site_carousel },
    { name: 'site_mda_logos', drizzleTable: schema.site_mda_logos },
  ];

  for (const table of tables) {
    console.log(`Migrating table: ${table.name}...`);
    const { data, error } = await supabase.from(table.name).select('*');

    if (error) {
      console.error(`Error fetching data for ${table.name}:`, error.message);
      continue;
    }

    if (data && data.length > 0) {
      console.log(`Found ${data.length} rows for ${table.name}.`);
      
      // Clear existing data in MySQL (optional, but good for clean migration)
      // await db.delete(table.drizzleTable);

      // Insert in chunks of 100 to avoid packet size issues
      for (let i = 0; i < data.length; i += 100) {
        const chunk = data.slice(i, i + 100).map(row => {
          const processedRow: any = { ...row };
          if (table.name === 'users') {
            processedRow.id = row.uid;
            delete processedRow.uid;
          }
          for (const key in processedRow) {
            if (typeof processedRow[key] === 'string' && processedRow[key].match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
              processedRow[key] = new Date(processedRow[key]);
            }
          }
          return processedRow;
        });
        
        try {
          await db.insert(table.drizzleTable).values(chunk);
        } catch (err: any) {
          console.error(`Error inserting chunk for ${table.name}:`, err.message);
        }
      }
    } else {
      console.log(`No data found for ${table.name}.`);
    }
  }

  console.log('Migration finished!');
  await connection.end();
}

migrate().catch(console.error);
