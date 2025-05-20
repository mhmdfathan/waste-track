import { z } from 'zod';
import { WasteType } from '@prisma/client';

export const monthlyStatisticsSchema = z.object({
  id: z.string().cuid(),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  wasteType: z.nativeEnum(WasteType),
  totalTransactions: z.number().int().min(0).default(0),
  totalVolume: z.number().min(0).default(0),
  totalValue: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Define the shape of metrics for each waste type
const wasteTypeMetricSchema = z.object({
  transactions: z.number().int().min(0),
  volume: z.number().min(0),
  value: z.number().int().min(0),
  averagePrice: z.number().min(0).optional(),
  lastUpdated: z.date().optional(),
});

export const statisticsSchema = z.object({
  id: z.string().cuid(),
  totalTransactions: z.number().int().min(0).default(0),
  totalVolume: z.number().min(0).default(0),
  totalTimbangWeight: z.number().min(0).default(0),
  totalValue: z.number().int().min(0).default(0),
  wasteTypeMetrics: z.record(z.nativeEnum(WasteType), wasteTypeMetricSchema),
  updatedAt: z.date(),
});

export const createMonthlyStatisticsSchema = monthlyStatisticsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateMonthlyStatisticsSchema = monthlyStatisticsSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

export const updateStatisticsSchema = statisticsSchema
  .partial()
  .omit({ id: true, updatedAt: true });
