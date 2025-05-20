import { z } from 'zod';
import { Role } from '@prisma/client';

export const userRoleSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().uuid(),
  role: z.nativeEnum(Role),
  saldo: z.number().int().min(0).default(0),
  nilaiTimbang: z.number().int().min(0).default(0),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  image: z.string().url().nullable(),
  qrisCode: z.string().url().nullable(),
  address: z.string().default(''),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  createdAt: z.date(),
  isActive: z.boolean().default(true),
});

export const createUserSchema = userRoleSchema.omit({
  id: true,
  createdAt: true,
  saldo: true,
  nilaiTimbang: true,
  isActive: true,
});

export const updateUserSchema = userRoleSchema
  .partial()
  .omit({ id: true, userId: true, createdAt: true });
