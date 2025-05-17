import { NextResponse } from 'next/server';
import prisma from '@/app/utils/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return new NextResponse('User ID is required', { status: 400 });
  }
  try {
    const profile = await prisma.userRole.findUnique({
      where: {
        userId: userId,
      },
      include: {
        companyProfile: true,
        timbangData: {
          include: {
            transaction: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Get last 5 timbang records
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
