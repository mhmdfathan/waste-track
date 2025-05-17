'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/app/utils/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function handleSubmission(formData: FormData) {
  const supabase = await createClient(); // Correct: createClient() is not a promise here
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login'); // Redirect to Supabase login
  }

  const title = formData.get('title');
  const content = formData.get('content');
  const url = formData.get('url');
  await prisma.wasteListing.create({
    data: {
      title: title as string,
      description: content as string,
      imageUrl: url as string,
      authorId: user.id,
      authorImage: user.user_metadata?.picture ?? '',
      authorName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous',
      price: 0, // This should be updated in the form
      wasteType: 'RECYCLABLE', // This should be updated in the form
      weight: 0, // This should be updated in the form
      status: 'AVAILABLE',
    },
  });

  revalidatePath('/');
  return redirect('/dashboard');
}

export async function editPost(formData: FormData, id: string) {
  const supabase = await createClient(); // Correct: createClient() is not a promise here
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login'); // Redirect to Supabase login
  }

  const title = formData.get('title');
  const content = formData.get('content');
  const url = formData.get('url');
  await prisma.wasteListing.update({
    where: {
      id: id,
      authorId: user.id, // ensure the user can only edit their own posts
    },
    data: {
      title: title as string,
      description: content as string,
      imageUrl: url as string,
    },
  });

  revalidatePath('/');
  return redirect('/dashboard');
}
