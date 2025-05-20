import { z } from 'zod';
import { WasteType } from '@prisma/client';

export const companyProfileSchema = z.object({
  id: z.string().cuid(),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters long'),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  description: z.string().nullable(),
  logo: z.string().url().nullable(),
  website: z.string().url().nullable(),
  deliveryRadius: z.number().positive().default(50),
  deliveryFeeBase: z.number().int().min(0).default(10000),
  feePerKm: z.number().int().min(0).default(1000),
  acceptedWasteTypes: z.array(z.nativeEnum(WasteType)),
  userId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCompanyProfileSchema = companyProfileSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    acceptedWasteTypes: z
      .array(z.nativeEnum(WasteType))
      .min(1, 'Must accept at least one waste type'),
  });

export const updateCompanyProfileSchema = companyProfileSchema
  .partial()
  .omit({ id: true, userId: true, createdAt: true, updatedAt: true });
