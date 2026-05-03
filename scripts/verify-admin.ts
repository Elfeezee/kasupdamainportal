
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { users } from './src/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const poolConnection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kasupda',
  });

  const db = drizzle(poolConnection);

  const email = 'admin@admin.com';
  const passwordToTest = 'kasupda2026';

  console.log(`Checking user: ${email}`);
  // @ts-ignore
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  if (!user) {
    console.log('User not found!');
  } else {
    console.log('User found. Hashed password in DB:', user.password);
    const isValid = await bcrypt.compare(passwordToTest, user.password as string);
    console.log(`Password 'kasupda2026' is valid: ${isValid}`);
  }

  await poolConnection.end();
}

main().catch(console.error);
