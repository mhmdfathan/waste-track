import { z } from 'zod';
import { WasteType } from '@prisma/client';

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'Company name is too short'),
  address: z.string().min(5, 'Address must be more detailed'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().regex(/^[0-9+\-() ]+$/, 'Invalid phone number format'),
  description: z.string().max(500, 'Description is too long').optional(),
  logo: z.string().url('Invalid logo URL').optional().nullable(),
  website: z.string().url('Invalid website URL').optional().nullable(),
  deliveryRadius: z.number().min(1).max(200).default(50),
  deliveryFeeBase: z.number().int().min(0).max(1000000).default(10000),
  feePerKm: z.number().int().min(0).max(100000).default(1000),
  acceptedWasteTypes: z
    .array(z.nativeEnum(WasteType))
    .min(1, 'At least one waste type must be accepted'),
});
