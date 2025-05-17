// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createClient } from '@/lib/supabase/server';
import prisma from '@/app/utils/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const profile = await prisma.userRole.findUnique({
      where: {
        userId: userId,
      },
      include: {
        companyProfile: true,
        timbangData: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            transaction: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
