/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, CircleDollarSign, Info } from 'lucide-react';
import { TransactionStatus, TransactionType } from '@prisma/client';
import { format } from 'date-fns';
import { TransactionData } from '../page';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const columns: ColumnDef<TransactionData, any>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-help">
              <span className="font-mono">{id.slice(0, 8)}...</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type: TransactionType = row.getValue('type');
      return (
        <Badge
          variant={type === 'WASTE_LISTING_SALE' ? 'default' : 'secondary'}
        >
          {type === 'WASTE_LISTING_SALE' ? 'Sale' : 'Timbang'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status: TransactionStatus = row.getValue('status');
      const variant = {
        PENDING: 'secondary',
        COMPLETED: 'default',
        CANCELLED: 'destructive',
      }[status] as 'default' | 'destructive' | 'secondary';

      return (
        <Badge variant={variant}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('createdAt')), 'PPp');
    },
  },
  {
    accessorKey: 'seller',
    header: 'Seller',
    cell: ({ row }) => {
      const seller = row.getValue('seller') as { name: string; email: string };
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-help">
              <span>{seller.name}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{seller.email}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({ row }) => {
      const transaction = row.original;
      const details = [];

      if (transaction.wasteListing) {
        details.push(`Waste Listing: ${transaction.wasteListing.title}`);
        details.push(`Weight: ${transaction.wasteListing.weight}kg`);
      }

      if (transaction.timbangData) {
        details.push(`Timbang Weight: ${transaction.timbangData.weight}kg`);
        details.push(
          `Value: Rp${transaction.timbangData.value.toLocaleString()}`,
        );
      }

      if (transaction.deliveryFee) {
        details.push(
          `Delivery Fee: Rp${transaction.deliveryFee.toLocaleString()}`,
        );
        details.push(`Distance: ${transaction.deliveryDistance}km`);
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {details.map((detail, i) => (
                  <p key={i}>{detail}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
