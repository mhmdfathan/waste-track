/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@/app/utils/db';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
} from '@prisma/client';
import { TransactionData } from './page';

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
