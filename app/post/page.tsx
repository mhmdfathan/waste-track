/* eslint-disable @typescript-eslint/no-unused-vars */

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { BlogPostCard } from '@/components/general/BlogpostCard';
import { BlogSidebar } from '@/components/general/BlogSidebar';
import prisma from '@/app/utils/db';
import { BlogPost } from '@/types/blog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export const revalidate = 60;

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  _count: {
    posts: number;
  };
}

async function getData(): Promise<{
  posts: BlogPost[];
  categories: CategoryWithCount[];
  recentPosts: BlogPost[];
}> {
  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        authorId: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        viewCount: true,
        status: true,
        author: {
          select: {
            userId: true,
            name: true,
            image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    }),
  ]);

  const recentPosts = posts.slice(0, 5);

  return {
    posts,
    categories,
    recentPosts,
  };
}

export default function BlogPage() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Blog Posts
        </h1>
        <p className="text-muted-foreground">
          Read the latest articles about waste management and sustainability
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <Suspense fallback={<BlogPostsGrid />}>
            <BlogPosts />
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<BlogSidebarSkeleton />}>
            <BlogSidebarContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function BlogPosts() {
  const { posts } = await getData();

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <BlogPostCard key={post.id} data={post} />
      ))}
    </div>
  );
}

function BlogPostsGrid() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <div className="relative">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function BlogSidebarContent() {
  const { categories, recentPosts } = await getData();
  return <BlogSidebar categories={categories} recentPosts={recentPosts} />;
}

function BlogSidebarSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Categories skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent posts skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-4">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
