import { z } from 'zod';
import { PickupStatus } from '@prisma/client';

export const pickupScheduleSchema = z.object({
  id: z.string().cuid(),
  scheduledAt: z.date().min(new Date(), 'Scheduled time must be in the future'),
  status: z.nativeEnum(PickupStatus),
  notes: z.string().max(500, 'Notes must not exceed 500 characters').optional(),
  pickupAddress: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  pickupLatitude: z
    .number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude'),
  pickupLongitude: z
    .number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude'),
  distance: z
    .number()
    .min(0, 'Distance must be positive')
    .max(1000, 'Distance seems too large'),
  transactionId: z.string(),
  companyId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createPickupScheduleSchema = pickupScheduleSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePickupScheduleSchema = pickupScheduleSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  transactionId: true,
  companyId: true,
});
