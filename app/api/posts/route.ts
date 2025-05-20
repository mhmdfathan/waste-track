import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/utils/db';
import { postSchema } from '@/app/schemas/blog';
import { createClient } from '@/lib/supabase/server';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
      },
      include: {
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
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validate request body
    const validatedData = postSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: user.id,
      },
    });

    // Update category post count
    await prisma.category.update({
      where: { id: validatedData.categoryId },
      data: {
        totalPosts: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 },
    );
  }
}
