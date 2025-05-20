import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/app/utils/db';
import { categorySchema } from '@/app/schemas/blog';
import { ZodError } from 'zod';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: validatedData,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid input' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 },
    );
  }
}
