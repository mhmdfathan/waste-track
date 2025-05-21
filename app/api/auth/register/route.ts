import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth-utils';
import { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json();

    // Validate inputs
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'All fields are required (email, password, name, role)' },
        { status: 400 },
      );
    }

    // Validate role
    if (!Object.values(Role).includes(role as Role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Register the user
    const result = await registerUser(email, password, name, role as Role);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Return user and profile data
    return NextResponse.json(
      {
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        },
        profile: result.profile,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 },
    );
  }
}
