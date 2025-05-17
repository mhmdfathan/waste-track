import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto flex h-[80vh] flex-col items-center justify-center gap-4">
      <Skeleton className="h-16 w-16" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-10 w-32 mt-4" />
    </div>
  );
}
