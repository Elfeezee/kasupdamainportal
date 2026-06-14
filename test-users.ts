
import 'dotenv/config';
import { db } from './src/lib/db';
import { users } from './src/lib/db/schema';
import { desc } from 'drizzle-orm';

async function test() {
    console.log('Using DB_NAME:', process.env.DB_NAME);
    const data = await db.select().from(users).orderBy(desc(users.created_at));
    console.log('Total users found:', data.length);
    console.log('Latest 5 users:');
    data.slice(0, 5).forEach(u => console.log(`${u.id} - ${u.email} - ${u.created_at}`));
}

test().catch(console.error);
