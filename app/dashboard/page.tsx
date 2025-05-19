import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import prisma from '@/app/utils/db';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { WasteListingCard } from '@/components/general/WasteListingCard';

async function getData(userId: string) {
  const data = await prisma.wasteListing.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return data;
}

export default async function DashboardRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const data = await getData(user.id);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage and track your waste management listings
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Your Listings</h2>
        <Link className={buttonVariants()} href="/dashboard/create">
          Create Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <WasteListingCard data={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
