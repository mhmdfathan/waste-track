import { z } from 'zod';

export const coordinatesSchema = z.object({
  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});

export const locationSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters'),
  ...coordinatesSchema.shape,
  formattedAddress: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
});

export const distanceSchema = z.object({
  distance: z.number().min(0).max(20000), // Max distance in km
  unit: z.enum(['km', 'mi']).default('km'),
});

export const deliveryFeeSchema = z.object({
  basePrice: z.number().int().min(0),
  pricePerKm: z.number().int().min(0),
  distance: z.number().min(0),
  freeDeliveryRadius: z.number().min(0).optional(),
});
