'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/app/utils/db';
import { createWasteListingSchema } from './schemas/waste-listing';

export async function handleSubmission(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  try {
    const validatedFields = createWasteListingSchema.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
      url: formData.get('url'),
      price: parseInt(formData.get('price') as string) || 0,
      weight: parseFloat(formData.get('weight') as string) || 0,
      wasteType: formData.get('wasteType'),
    });

    if (!validatedFields.success) {
      throw new Error(
        validatedFields.error.errors[0]?.message || 'Invalid input',
      );
    }

    const listing = await prisma.wasteListing.create({
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.content,
        imageUrl: validatedFields.data.url,
        authorId: user.id,
        authorImage: user.user_metadata?.picture ?? '',
        authorName: user.user_metadata?.full_name ?? user.email ?? 'Anonymous',
        price: validatedFields.data.price,
        wasteType: validatedFields.data.wasteType,
        weight: validatedFields.data.weight,
        status: 'AVAILABLE',
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath(`/listing/${listing.id}`);
    redirect('/dashboard');
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create listing',
    );
  }
}

export async function editPost(formData: FormData, id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  try {
    const validatedFields = createWasteListingSchema.safeParse({
      title: formData.get('title'),
      content: formData.get('content'),
      url: formData.get('url'),
      price: parseInt(formData.get('price') as string) || 0,
      weight: parseFloat(formData.get('weight') as string) || 0,
      wasteType: formData.get('wasteType'),
    });

    if (!validatedFields.success) {
      return {
        error: validatedFields.error.errors[0]?.message || 'Invalid input',
      };
    }

    const listing = await prisma.wasteListing.update({
      where: { id },
      data: {
        title: validatedFields.data.title,
        description: validatedFields.data.content,
        imageUrl: validatedFields.data.url,
        price: validatedFields.data.price,
        wasteType: validatedFields.data.wasteType,
        weight: validatedFields.data.weight,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath(`/listing/${listing.id}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating listing:', error);
    return { error: 'Failed to update listing' };
  }
}

export async function getProfile(userId: string) {
  try {
    const profile = await prisma.userRole.findUnique({
      where: {
        userId: userId,
      },
      include: {
        companyProfile: true,
      },
    });
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}
