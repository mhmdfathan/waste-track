/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { contactFormSchema } from '@/app/schemas/contact';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
  try {
    // Validate form data
    const validatedFields = contactFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0]?.message || 'Invalid input',
      };
    }

    // Here you would typically send email or save to database
    // For now, we'll just simulate success
    await new Promise((resolve) => setTimeout(resolve, 1000));

    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    return {
      error: 'An unexpected error occurred',
    };
  }
}
