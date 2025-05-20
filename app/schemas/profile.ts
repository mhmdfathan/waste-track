import { z } from 'zod';
import { WasteType } from '@prisma/client';

export const createProfileSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['NASABAH', 'PERUSAHAAN', 'PEMERINTAH', 'ADMIN']),
  address: z.string().default(''),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  saldo: z.number().int().min(0).default(0),
  nilaiTimbang: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const createCompanyProfileOnSignupSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  address: z.string().default(''),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().default(''),
  description: z.string().default(''),
  deliveryRadius: z.number().min(0).max(1000).default(50),
  deliveryFeeBase: z.number().int().min(0).default(10000),
  feePerKm: z.number().int().min(0).default(1000),
  acceptedWasteTypes: z
    .array(z.nativeEnum(WasteType))
    .default(['RECYCLABLE', 'NON_RECYCLABLE']),
});
