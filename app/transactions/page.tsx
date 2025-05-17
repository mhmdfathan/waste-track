import { Metadata } from 'next';
import { getTransactions } from './actions';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  TransactionStatus,
  TransactionType,
  WasteType,
  PickupStatus,
} from '@prisma/client';

export type TransactionData = {
  id: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  description?: string | null;
  deliveryFee?: number | null;
  deliveryDistance?: number | null;
  isDeliveryFree?: boolean | null;
  wasteListingId?: string | null;
  sellerId: string;
  buyerId?: string | null;
  createdAt: string;
  updatedAt: string;
  wasteListing?: {
    title: string;
    wasteType: WasteType;
    weight: number;
  } | null;
  seller: {
    name: string;
    email: string;
  };
  buyer?: {
    name: string;
    email: string;
  } | null;
  timbangData?: {
    id: string;
    value: number;
    createdAt: string;
    wasteType: WasteType;
    weight: number;
    updatedAt: string;
    nasabahId: string;
    transactionId: string;
  } | null;
  pickupSchedule?: {
    scheduledAt: string;
    status: PickupStatus;
    pickupAddress: string;
  } | null;
};

export const metadata: Metadata = {
  title: 'Transactions | Waste Track',
  description: 'View and manage your waste transactions',
};

export default async function Page() {
  const transactions = await getTransactions();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
