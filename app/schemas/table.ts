import { z } from 'zod';
import { WasteType, ListingStatus } from '@prisma/client';

export const listingTableSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().int().min(0).max(1000000000), // Max 1 billion IDR
  wasteType: z.nativeEnum(WasteType),
  weight: z.number().min(0.1).max(10000), // 0.1kg to 10,000kg
  status: z.nativeEnum(ListingStatus),
  sort: z.enum(['price', 'weight', 'createdAt', 'status']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const searchParamsSchema = z.object({
  q: z.string().optional(),
  type: z.nativeEnum(WasteType).optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  minWeight: z.number().min(0).optional(),
  maxWeight: z.number().max(10000).optional(),
  status: z.nativeEnum(ListingStatus).optional(),
});
