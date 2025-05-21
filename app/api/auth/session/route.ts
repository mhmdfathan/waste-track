import { NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth-utils';

export async function GET() {
  try {
    // Get the current user from the session
    const user = await validateSession();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Return the user data (without password)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in session API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
