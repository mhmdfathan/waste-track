import { createClient } from '@/lib/supabase/server';
import prisma from '@/app/utils/db';
import { type NextRequest } from 'next/server';
import slugify from 'slugify';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Only allow PEMERINTAH role to create posts
    const userRole = await prisma.userRole.findUnique({
      where: { userId: user.id },
    });

    if (!userRole || userRole.role !== 'PEMERINTAH') {
      return new Response('Forbidden', { status: 403 });
    }

    const json = await req.json();
    const { title, content, imageUrl, categoryId } = json;

    if (!title || !content || !imageUrl || !categoryId) {
      return new Response('Missing required fields', { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: slugify(title),
        content,
        imageUrl,
        authorId: userRole.id,
        categoryId,
        status: 'PUBLISHED',
      },
    });

    // Update category post count
    await prisma.category.update({
      where: { id: categoryId },
      data: {
        totalPosts: {
          increment: 1,
        },
      },
    });

    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
