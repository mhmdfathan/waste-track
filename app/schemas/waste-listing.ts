import { z } from 'zod';
import { ListingStatus, WasteType } from '@prisma/client';

export const wasteListingSchema = z.object({
  id: z.string().cuid(),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long'),
  price: z.number().int().min(0, 'Price must be a positive number'),
  imageUrl: z.string().url('Please provide a valid image URL'),
  wasteType: z.nativeEnum(WasteType, {
    errorMap: () => ({ message: 'Please select a valid waste type' }),
  }),
  weight: z.number().min(0.1, 'Weight must be greater than 0.1'),
  authorId: z.string(),
  authorName: z.string(),
  authorImage: z.string().url(),
  status: z.nativeEnum(ListingStatus).default(ListingStatus.AVAILABLE),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createWasteListingSchema = wasteListingSchema
  .omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
    authorId: true,
    authorName: true,
    authorImage: true,
  })
  .extend({
    url: z.string().url('Please provide a valid image URL'),
    content: z
      .string()
      .min(10, 'Description must be at least 10 characters long'),
  });

export const updateWasteListingSchema = wasteListingSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true, authorId: true });
