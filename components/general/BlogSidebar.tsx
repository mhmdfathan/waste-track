import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { BlogPost } from '@/types/blog';

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

interface BlogSidebarProps {
  categories: Category[];
  recentPosts: BlogPost[];
}

export function BlogSidebar({ categories, recentPosts }: BlogSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <form className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search articles..."
                name="search"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Find articles about waste management, sustainability, and more
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/post?category=${category.slug}`}
                className="flex justify-between items-center p-2 rounded-lg hover:bg-accent group"
              >
                <span className="text-sm group-hover:text-foreground">
                  {category.name}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({category._count.posts})
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Recent Articles</h3>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex gap-4">
                <Link
                  href={`/post/${post.slug}`}
                  className="relative h-16 w-16 overflow-hidden rounded-md"
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/post/${post.slug}`}>
                    <h4 className="text-sm font-medium leading-tight hover:text-primary line-clamp-2">
                      {post.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
