import { prisma } from '@/app/utils/db';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getData(id: string) {
  const data = await prisma.blogPost.findUnique({
    where: {
      id: id,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ id: string }>;

// ...existing code...

export default async function IdPage({ params }: { params: Params }) {
  const { id } = await params;
  const data = await getData(id);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Link className={buttonVariants({ variant: 'secondary' })} href="/">
          Back to Listings
        </Link>

        <Link
          className={buttonVariants({ variant: 'secondary' })}
          href={`/dashboard/edit/${id}`}
        >
          Edit Listing
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {data.title}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="relative size-10 overflow-hidden rounded-full">
              <Image
                src={data.authorImage}
                alt={data.authorName}
                fill
                className="object-cover"
              />
            </div>
            <p className="font-medium">{data.authorName}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(data.createdAt)}
          </p>
        </div>
      </div>

      <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
        <Image
          src={data.imageUrl}
          alt={data.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <p>{data.content}</p>
        </CardContent>
      </Card>
    </div>
  );
}
