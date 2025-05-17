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

  await prisma.blogPost.create({
    data: {
      title: title as string,
      content: content as string,
      imageUrl: url as string,
      authorId: user.id,
      authorImage: user.user_metadata?.picture ?? '', // Example: use avatar_url or a default
      authorName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous', // Example: use full_name or email
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

  await prisma.blogPost.update({
    where: {
      id: id,
      authorId: user.id, // ensure the user can only edit their own posts
    },
    data: {
      title: title as string,
      content: content as string,
      imageUrl: url as string,
    },
  });

  revalidatePath('/');
  return redirect('/dashboard');
}
