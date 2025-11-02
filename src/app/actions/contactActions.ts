'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export async function saveContactMessage(
  formData: FormData
): Promise<{ success: boolean; error?: string; fieldErrors?: any }> {
  const supabase = createSupabaseServerClient();
  
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
      error: 'Please check the form fields for errors.',
    };
  }

  const { name, email, subject, message } = validatedFields.data;

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }]);
    
    if (error) throw error;

    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown server error occurred.';
    console.error('Save Contact Message Error:', errorMessage);
    return { success: false, error: `Failed to save message: ${errorMessage}` };
  }
}
