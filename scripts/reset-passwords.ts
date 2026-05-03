
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from '../src/lib/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

// Load .env
dotenv.config();

async function main() {
  const poolConnection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kasupda',
  });

  const db = drizzle(poolConnection);

  const newPassword = 'kasupda2026';
  console.log(`Hashing password: ${newPassword}...`);
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log('Updating all users...');
  // @ts-ignore
  const [result] = await db.update(users).set({ password: hashedPassword });

  // @ts-ignore
  console.log(`Update complete! Affected rows: ${result.affectedRows}`);

  await poolConnection.end();
}

main().catch((err) => {
  console.error('Error resetting passwords:', err);
  process.exit(1);
});
