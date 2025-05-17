import prisma from '@/app/utils/db';
import { buttonVariants } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/server';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getData(id: string) {
  const data = await prisma.wasteListing.findUnique({
    where: { id },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ id: string }>;

export default async function IdPage({ params }: { params: Params }) {
  const { id } = await params;
  const data = await getData(id);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === data.authorId;

  const formatToRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/" className={buttonVariants({ variant: 'ghost' })}>
          ← Back to listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Image Gallery */}
        <div className="sticky top-6 space-y-4 h-fit">
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
            <Image
              src={data.imageUrl}
              alt={data.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute top-4 right-4 space-x-2">
              <Badge
                variant={
                  data.wasteType === 'RECYCLABLE' ? 'default' : 'destructive'
                }
                className="capitalize"
              >
                {data.wasteType.toLowerCase().replace('_', ' ')}
              </Badge>
              <Badge
                variant={data.status === 'AVAILABLE' ? 'default' : 'secondary'}
              >
                {data.status.toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="lg:px-6">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-8 pr-4">
              {/* Title and Price */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  {data.title}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {formatToRupiah(data.price)}
                  </span>
                  <span className="text-base text-muted-foreground">
                    per listing
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-base py-1.5 px-4">
                    {data.weight} kg
                  </Badge>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {formatToRupiah(Math.round(data.price / data.weight))} / kg
                  </span>
                </div>
              </div>

              <Separator />

              {/* Seller Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Seller Information</h2>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={data.authorImage} alt={data.authorName} />
                    <AvatarFallback>{data.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg">{data.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                      Listed on{' '}
                      {new Intl.DateTimeFormat('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }).format(data.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {data.description}
                </p>
              </div>

              <Separator />

              {/* Waste Details */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Waste Details</h2>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">
                      {data.wasteType.toLowerCase().replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{data.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Price per kg</p>
                    <p className="font-medium">
                      {formatToRupiah(Math.round(data.price / data.weight))}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">
                      {data.status.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-background pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {isOwner ? (
                    <>
                      <Button size="lg" className="w-full" asChild>
                        <Link href={`/dashboard/edit/${id}`}>Edit Listing</Link>
                      </Button>
                      <Button size="lg" variant="outline" className="w-full">
                        Delete Listing
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="lg" className="w-full">
                        Contact Seller
                      </Button>
                      <Button size="lg" variant="outline" className="w-full">
                        Make Offer
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
