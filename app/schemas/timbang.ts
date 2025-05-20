import { z } from 'zod';
import { WasteType } from '@prisma/client';

export const timbangFormSchema = z.object({
  wasteType: z.enum(['RECYCLABLE', 'NON_RECYCLABLE'], {
    required_error: 'Please select a waste type',
    invalid_type_error: 'Invalid waste type',
  }),
  weight: z
    .number({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight must be a number',
    })
    .positive('Weight must be greater than 0')
    .max(1000, 'Weight cannot exceed 1000 kg')
    .transform((val) => Number(val.toFixed(2))), // Round to 2 decimal places
});

export const timbangDataSchema = z.object({
  id: z.string().cuid(),
  weight: z.number().positive('Weight must be a positive number'),
  wasteType: z.nativeEnum(WasteType),
  value: z.number().int().positive('Value must be a positive number'),
  nasabahId: z.string().uuid(),
  transactionId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTimbangDataSchema = timbangDataSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTimbangDataSchema = timbangDataSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true, nasabahId: true });
