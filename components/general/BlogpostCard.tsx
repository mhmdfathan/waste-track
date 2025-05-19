import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  data: BlogPost;
}

export function BlogPostCard({ data }: BlogPostCardProps) {
  const timeAgo = formatDistanceToNow(new Date(data.createdAt), {
    addSuffix: true,
  });

  return (
    <Card>
      <div className="relative">
        <Link href={`/post/${data.slug}`}>
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={data.imageUrl}
              alt={data.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
        <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded px-2 py-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <time dateTime={data.createdAt.toISOString()}>{timeAgo}</time>
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Link href={`/post/${data.slug}`} className="group">
              <h2 className="line-clamp-2 text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                {data.title}
              </h2>
            </Link>{' '}
            <p className="line-clamp-3 text-muted-foreground">
              {data.content.substring(0, 160) + '...'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={data.author.image || ''} />
                <AvatarFallback>
                  {data.author.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {data.author.name}
                </p>
                <Link
                  href={`/post?category=${data.category.slug}`}
                  className="inline-block"
                >
                  <Badge variant="secondary">{data.category.name}</Badge>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
