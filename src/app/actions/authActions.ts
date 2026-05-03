
'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function signUp(formData: any) {
    const { applicantName, email, phone, password } = formData;

    try {
        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingUser) {
            return { success: false, error: 'User already registered with this email.' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users).values({
            id: uuidv4(),
            name: applicantName,
            email: email,
            phone: phone,
            password: hashedPassword,
            role: 'Applicant',
        });

        return { success: true };
    } catch (error: any) {
        console.error('Sign Up Error:', error);
        return { success: false, error: error.message || 'Failed to sign up.' };
    }
}
