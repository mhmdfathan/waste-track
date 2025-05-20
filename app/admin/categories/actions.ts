/* eslint-disable @typescript-eslint/no-unused-vars */
'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/app/utils/db';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
});

export async function createCategory(formData: FormData) {
  const data = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  };

  const validatedFields = categorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    await prisma.category.create({
      data: validatedFields.data,
    });

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { error: 'A category with this name or slug already exists' };
    }
    return { error: 'Something went wrong' };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const data = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  };

  const validatedFields = categorySchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields' };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: validatedFields.data,
    });

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return { error: 'A category with this name or slug already exists' };
    }
    return { error: 'Something went wrong' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    return { error: 'Something went wrong' };
  }
}
