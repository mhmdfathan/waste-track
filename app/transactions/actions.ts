'use server';

import { createClient } from '@/lib/supabase/server';
import { TransactionStatus, TransactionType, WasteType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import prisma from '@/app/utils/db';
import { ZodError } from 'zod';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../schemas/transaction';
import { createTimbangDataSchema } from '../schemas/timbang';
import { createPickupScheduleSchema } from '../schemas/pickup';
import type { TransactionData } from './page';

export async function createTransaction(
  formData: FormData,
  type: TransactionType,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  try {
    // Prepare base transaction data
    const baseData = {
      type,
      sellerId: user.id,
      amount: parseInt(formData.get('amount') as string),
      description: (formData.get('description') as string) || null,
    };

    // Add type-specific data
    let transactionData;
    if (type === TransactionType.WASTE_LISTING_SALE) {
      transactionData = {
        ...baseData,
        wasteListingId: formData.get('wasteListingId') as string,
        buyerId: (formData.get('buyerId') as string) || null,
        deliveryFee: parseInt(formData.get('deliveryFee') as string) || null,
        deliveryDistance:
          parseFloat(formData.get('deliveryDistance') as string) || null,
        isDeliveryFree: formData.get('isDeliveryFree') === 'true',
      };
    } else {
      // TIMBANG_SUBMISSION type
      transactionData = baseData;
    }

    // Validate transaction data
    const validatedTransaction = createTransactionSchema.parse(transactionData);

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: validatedTransaction,
    });

    // Handle timbang data if this is a timbang submission
    if (type === TransactionType.TIMBANG_SUBMISSION) {
      const timbangData = {
        weight: parseFloat(formData.get('weight') as string),
        wasteType: formData.get('wasteType') as WasteType,
        value: parseInt(formData.get('value') as string),
        nasabahId: user.id,
        transactionId: transaction.id,
      };

      // Validate timbang data
      const validatedTimbangData = createTimbangDataSchema.parse(timbangData);

      await prisma.timbangData.create({
        data: validatedTimbangData,
      });
    }

    // Handle pickup schedule if delivery is requested
    if (formData.get('needsPickup') === 'true') {
      const pickupData = {
        scheduledAt: new Date(formData.get('pickupDate') as string),
        pickupAddress: formData.get('pickupAddress') as string,
        pickupLatitude: parseFloat(formData.get('pickupLatitude') as string),
        pickupLongitude: parseFloat(formData.get('pickupLongitude') as string),
        distance: parseFloat(formData.get('distance') as string),
        notes: (formData.get('notes') as string) || null,
        transactionId: transaction.id,
        companyId: formData.get('companyId') as string,
      };

      // Validate pickup data
      const validatedPickupData = createPickupScheduleSchema.parse(pickupData);

      await prisma.pickupSchedule.create({
        data: validatedPickupData,
      });
    }

    revalidatePath('/transactions');
    return { success: true };
  } catch (error) {
    console.error('Transaction error:', error);

    if (error instanceof ZodError) {
      return {
        error: error.errors[0]?.message || 'Invalid input data',
      };
    }

    return { error: 'Failed to create transaction' };
  }
}

export async function updateTransactionStatus(
  id: string,
  status: TransactionStatus,
  pickupScheduleData?: FormData,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  try {
    const validatedData = updateTransactionSchema.safeParse({
      status,
    });

    if (!validatedData.success) {
      return {
        error: validatedData.error.errors[0]?.message || 'Invalid input',
      };
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // Update transaction status
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: { status },
        include: {
          wasteListing: true,
        },
      });

      // If transaction is completed and it's a waste listing sale
      if (status === 'COMPLETED' && updatedTransaction.wasteListingId) {
        await tx.wasteListing.update({
          where: { id: updatedTransaction.wasteListingId },
          data: { status: 'SOLD' },
        });
      }

      // If transaction is cancelled and it's a waste listing sale
      if (status === 'CANCELLED' && updatedTransaction.wasteListingId) {
        await tx.wasteListing.update({
          where: { id: updatedTransaction.wasteListingId },
          data: { status: 'AVAILABLE' },
        });
      }

      // If pickup schedule data is provided and status is COMPLETED
      if (pickupScheduleData && status === 'COMPLETED') {
        const validatedPickup = createPickupScheduleSchema.safeParse({
          scheduledAt: new Date(
            pickupScheduleData.get('scheduledAt') as string,
          ),
          pickupAddress: pickupScheduleData.get('pickupAddress'),
          pickupLatitude: parseFloat(
            pickupScheduleData.get('pickupLatitude') as string,
          ),
          pickupLongitude: parseFloat(
            pickupScheduleData.get('pickupLongitude') as string,
          ),
          distance: parseFloat(pickupScheduleData.get('distance') as string),
          companyId: pickupScheduleData.get('companyId'),
          transactionId: id,
        });

        if (validatedPickup.success) {
          await tx.pickupSchedule.create({
            data: validatedPickup.data,
          });
        }
      }

      return updatedTransaction;
    });

    return { success: true, data: transaction };
  } catch (error) {
    console.error('Error updating transaction:', error);
    if (error instanceof ZodError) {
      return {
        error: error.errors[0]?.message || 'Invalid input',
      };
    }
    return { error: 'Failed to update transaction' };
  }
}

export async function getTransactions(filters?: {
  type?: TransactionType;
  status?: TransactionStatus;
  userId?: string;
}): Promise<TransactionData[]> {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        ...(filters?.type && { type: filters.type }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.userId && {
          OR: [{ sellerId: filters.userId }, { buyerId: filters.userId }],
        }),
      },
      include: {
        wasteListing: true,
        seller: true,
        buyer: true,
        timbangData: true,
        pickupSchedule: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert dates to strings for the client
    return transactions.map((transaction) => ({
      ...transaction,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      pickupSchedule: transaction.pickupSchedule
        ? {
            ...transaction.pickupSchedule,
            scheduledAt: transaction.pickupSchedule.scheduledAt.toISOString(),
          }
        : null,
      timbangData: transaction.timbangData
        ? {
            ...transaction.timbangData,
            createdAt: transaction.timbangData.createdAt.toISOString(),
            updatedAt: transaction.timbangData.updatedAt.toISOString(),
          }
        : null,
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transactions');
  }
}

export async function getTransactionById(
  id: string,
): Promise<TransactionData | null> {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        wasteListing: true,
        seller: true,
        buyer: true,
        timbangData: true,
        pickupSchedule: true,
      },
    });
    if (!transaction) return null;

    // Convert dates to strings for the client
    return {
      ...transaction,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      pickupSchedule: transaction.pickupSchedule
        ? {
            ...transaction.pickupSchedule,
            scheduledAt: transaction.pickupSchedule.scheduledAt.toISOString(),
          }
        : null,
      timbangData: transaction.timbangData
        ? {
            ...transaction.timbangData,
            createdAt: transaction.timbangData.createdAt.toISOString(),
            updatedAt: transaction.timbangData.updatedAt.toISOString(),
          }
        : null,
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw new Error('Failed to fetch transaction');
  }
}
