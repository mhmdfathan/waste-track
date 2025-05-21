/* eslint-disable @typescript-eslint/no-unused-vars */
import prisma from '@/app/utils/db';
import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth-utils';

export async function GET(_request: Request) {
  const user = await validateSession();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = user.id;

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
