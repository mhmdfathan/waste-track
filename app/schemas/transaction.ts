import { z } from 'zod';
import { TransactionStatus, TransactionType } from '@prisma/client';

const baseTransactionSchema = z.object({
  id: z.string().cuid(),
  amount: z.number().int().min(0, 'Amount must be a positive number'),
  status: z.nativeEnum(TransactionStatus).default(TransactionStatus.PENDING),
  type: z.nativeEnum(TransactionType),
  description: z.string().nullable(),
  deliveryFee: z
    .number()
    .int()
    .min(0, 'Delivery fee must be a positive number')
    .nullable(),
  deliveryDistance: z
    .number()
    .min(0, 'Delivery distance must be a positive number')
    .nullable(),
  isDeliveryFree: z.boolean().nullable(),
  wasteListingId: z.string().cuid('Invalid waste listing ID').nullable(),
  sellerId: z.string().uuid('Invalid seller ID'),
  buyerId: z.string().uuid('Invalid buyer ID').nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const transactionSchema = baseTransactionSchema.superRefine(
  (data, ctx) => {
    // If it's a waste listing sale, we need a waste listing ID
    if (data.type === 'WASTE_LISTING_SALE' && !data.wasteListingId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Waste listing ID is required for waste listing sales',
        path: ['wasteListingId'],
      });
    }

    // For waste listing sales, we need delivery info if it's not free
    if (data.type === 'WASTE_LISTING_SALE' && !data.isDeliveryFree) {
      if (data.deliveryFee == null || data.deliveryDistance == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Delivery fee and distance are required when delivery is not free',
          path: ['deliveryFee'],
        });
      }
    }
  },
);

const baseCreateSchema = baseTransactionSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const createTransactionSchema = baseCreateSchema.superRefine(
  (data, ctx) => {
    // Additional validation for creation
    if (data.type === 'WASTE_LISTING_SALE' && !data.buyerId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Buyer ID is required for waste listing sales',
        path: ['buyerId'],
      });
    }
  },
);

export const updateTransactionSchema = z.object({
  status: z.nativeEnum(TransactionStatus),
  description: z.string().optional(),
});
