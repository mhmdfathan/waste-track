'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/app/utils/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function handleSubmission(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const url = formData.get('url') as string;
    const price = parseInt(formData.get('price') as string) || 0;
    const weight = parseFloat(formData.get('weight') as string) || 0;
    const wasteType = formData.get('wasteType') as
      | 'RECYCLABLE'
      | 'NON_RECYCLABLE';

    if (!title || !content || !url || !price || !weight || !wasteType) {
      throw new Error('All fields are required');
    }

    const listing = await prisma.wasteListing.create({
      data: {
        title,
        description: content,
        imageUrl: url,
        authorId: user.id,
        authorImage: user.user_metadata?.picture ?? '',
        authorName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous',
        price,
        wasteType,
        weight,
        status: 'AVAILABLE',
      },
    });

    revalidatePath('/');
    revalidatePath(`/listing/${listing.id}`);
    return redirect('/dashboard');
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
}

export async function editPost(formData: FormData, id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const url = formData.get('url') as string;
    const price = parseInt(formData.get('price') as string) || 0;
    const weight = parseFloat(formData.get('weight') as string) || 0;
    const wasteType = formData.get('wasteType') as
      | 'RECYCLABLE'
      | 'NON_RECYCLABLE';

    if (!title || !content || !url || !price || !weight || !wasteType) {
      throw new Error('All fields are required');
    }

    const listing = await prisma.wasteListing.update({
      where: {
        id: id,
        authorId: user.id,
      },
      data: {
        title,
        description: content,
        imageUrl: url,
        price,
        weight,
        wasteType,
      },
    });

    revalidatePath('/');
    revalidatePath(`/listing/${listing.id}`);
    return redirect('/dashboard');
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
}

export async function getProfile(userId: string) {
  return await prisma.userRole.findUnique({
    where: {
      userId: userId,
    },
    include: {
      companyProfile: true,
    },
  });
}
