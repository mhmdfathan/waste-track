import prisma from '@/app/utils/db';
import { notFound } from 'next/navigation';
import { EditForm } from './edit-form';

type Params = Promise<{ id: string }>;

export default async function IdPage({ params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }
  const listing = await prisma.wasteListing.findUnique({
    where: { id },
  });
  if (!listing) {
    notFound();
  }

  return <EditForm listing={listing} id={id} />;
}
