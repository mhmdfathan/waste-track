/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import { WasteType, TransactionType, TransactionStatus } from '@prisma/client';

export const currencySchema = z.object({
  amount: z.number().int().min(0, 'Amount must be positive'),
  currency: z.literal('IDR'),
});

export const priceSchema = z
  .number()
  .int()
  .min(0, 'Price must be positive')
  .max(1000000000, 'Price is too high'); // 1 billion IDR max

export const feeSchema = z
  .number()
  .int()
  .min(0, 'Fee must be positive')
  .max(10000000, 'Fee is too high'); // 10 million IDR max

export const transactionAmountSchema = z.object({
  amount: z.number().int().min(1000), // Minimum 1000 IDR
  wasteAmount: z.number().min(0.1).max(10000), // 0.1kg to 10,000kg
  pricePerKg: z.number().int().min(0),
  wasteType: z.nativeEnum(WasteType),
});
