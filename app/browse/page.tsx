import { WasteListingCard } from '@/components/general/WasteListingCard';
import prisma from '@/app/utils/db';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { WasteType, ListingStatus } from '@prisma/client';

export const revalidate = 60;

async function getData() {
  const data = await prisma.wasteListing.findMany({
    select: {
      title: true,
      description: true,
      price: true,
      imageUrl: true,
      wasteType: true,
      weight: true,
      authorId: true,
      authorName: true,
      authorImage: true,
      status: true,
      id: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return data;
}

export default function ListingsPage() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Latest Waste Listings
        </h1>
        <p className="text-muted-foreground">
          Browse available waste listings from our community
        </p>
      </div>
      <Suspense fallback={<WasteListingsGrid />}>
        <WasteListings />
      </Suspense>
    </div>
  );
}

async function WasteListings() {
  const data = await getData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(
        (item: {
          id: string;
          title: string;
          description: string;
          price: number;
          imageUrl: string;
          wasteType: WasteType;
          weight: number;
          authorId: string;
          authorName: string;
          authorImage: string;
          status: ListingStatus;
          createdAt: Date;
          updatedAt: Date;
        }) => (
          <WasteListingCard data={item} key={item.id} />
        ),
      )}
    </div>
  );
}

function WasteListingsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_: unknown, index: number) => (
        <div
          className="rounded-lg border bg-card text-card-foreground shadow-sm h-[400px] flex flex-col overflow-hidden"
          key={index}
        >
          {/* Image skeleton */}
          <Skeleton className="h-48 w-full rounded-none" />

          <div className="p-4 flex-1 flex flex-col gap-3">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />

            {/* Content skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Footer skeleton */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
