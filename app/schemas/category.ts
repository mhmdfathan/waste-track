import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
  description: z.string().max(500).nullable(),
  totalPosts: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalPosts: true,
});

export const updateCategorySchema = categorySchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true, totalPosts: true });
