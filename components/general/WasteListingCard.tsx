import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { WasteType, ListingStatus } from '@prisma/client';

interface IappProps {
  data: {
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
  };
}

export function WasteListingCard({ data }: IappProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-primary/20 bg-card shadow-md transition-all hover:shadow-lg">
      <Link href={`/listing/${data.id}`} className="block w-full h-full">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={data.imageUrl}
            alt="Waste listing image"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold text-primary">
            {data.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {data.description}
          </p>
          <div className="mb-4 text-sm">
            <p>
              Price:{' '}
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
              }).format(data.price)}
            </p>
            <p>Weight: {data.weight} kg</p>
            <p>Type: {data.wasteType.toLowerCase()}</p>
            <p>Status: {data.status.toLowerCase()}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                {data.authorImage ? (
                  <AvatarImage src={data.authorImage} alt={data.authorName} />
                ) : (
                  <AvatarFallback className="bg-emerald-500 text-white">
                    {data.authorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-sm font-medium">{data.authorName}</p>
            </div>
            <time className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }).format(data.createdAt)}
            </time>
          </div>
        </div>
      </Link>
    </div>
  );
}
