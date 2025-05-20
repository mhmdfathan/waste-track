'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Role } from '@prisma/client';
import prisma from '@/app/utils/db';
import { validateLogin, validateRegister } from './authValidation';
import { ZodError } from 'zod';

export async function login(formData: FormData) {
  const supabase = await createClient();

  try {
    // Validate input
    const validatedData = validateLogin(formData);

    const { error: signInError, data: signInData } =
      await supabase.auth.signInWithPassword(validatedData);

    if (signInError) {
      return {
        error: 'Invalid email or password',
      };
    }

    if (signInData.user) {
      // Check user role
      const userRole = await prisma.userRole.findUnique({
        where: {
          userId: signInData.user.id,
        },
        select: {
          role: true,
        },
      });

      revalidatePath('/', 'layout');

      // Redirect based on role
      if (userRole?.role === 'ADMIN') {
        redirect('/admin');
      } else {
        redirect('/');
      }
    }

    return {
      error: 'Something went wrong during sign in',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: error.errors[0]?.message || 'Invalid input',
      };
    }
    return {
      error: 'An unexpected error occurred',
    };
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  try {
    // Validate input using Zod schema
    const validatedData = validateRegister(formData);

    // For admin creation, verify that the request comes from an existing admin
    if (validatedData.role.toUpperCase() === Role.ADMIN) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return {
          error: 'Unauthorized to create admin accounts',
        };
      }

      const adminUser = await prisma.userRole.findUnique({
        where: { userId: user.id, role: Role.ADMIN },
      });
      if (!adminUser) {
        return {
          error: 'Unauthorized to create admin accounts',
        };
      }
    }

    // Proceed with signup
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp(
      {
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            name: validatedData.name,
            role: validatedData.role,
          },
        },
      },
    );

    if (signUpError) {
      return {
        error: signUpError.message,
      };
    }

    // Create user in database
    if (signUpData.user) {
      await prisma.userRole.create({
        data: {
          userId: signUpData.user.id,
          email: validatedData.email,
          name: validatedData.name,
          role: validatedData.role as Role,
          address: validatedData.address || '',
        },
      });

      revalidatePath('/', 'layout');
      redirect('/');
    }

    return {
      error: 'Something went wrong during sign up',
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: error.errors[0]?.message || 'Invalid input',
      };
    }
    return {
      error: 'An unexpected error occurred',
    };
  }
}
