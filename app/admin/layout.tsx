import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/app/utils/db';
import { Role } from '@prisma/client';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user's role
  const userRole = await prisma.userRole.findUnique({
    where: {
      userId: user.id,
    },
    select: {
      role: true,
    },
  });

  // Redirect non-admin users
  if (userRole?.role !== Role.ADMIN) {
    redirect('/');
  }

  return <div className="container max-w-7xl mx-auto p-6">{children}</div>;
}
