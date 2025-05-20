import { z } from 'zod';
import { PostStatus } from '@prisma/client';

export const postSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  content: z.string().min(10),
  imageUrl: z.string().url(),
  excerpt: z.string().max(500).nullable(),
  status: z.nativeEnum(PostStatus).default(PostStatus.DRAFT),
  authorId: z.string().uuid(),
  categoryId: z.string().cuid(),
  viewCount: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPostSchema = postSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
});

export const updatePostSchema = postSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

export const postSearchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(10),
});
