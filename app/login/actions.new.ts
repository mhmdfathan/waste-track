'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import prisma from '@/app/utils/db';
import { validateLogin, validateRegister } from './authValidation';
import { ZodError } from 'zod';
import { loginUser, registerUser, validateSession } from '@/lib/auth-utils';

export async function login(formData: FormData) {
  try {
    // Validate input
    const validatedData = validateLogin(formData);

    // Use our custom login function
    const result = await loginUser(validatedData.email, validatedData.password);

    if (!result.success) {
      return {
        error: result.error,
      };
    }

    if (result.user) {
      // Check user role
      const userRole = result.profile;

      if (!userRole) {
        return {
          error: 'User profile not found',
        };
      }

      revalidatePath('/', 'layout');

      // Redirect based on role
      if (userRole.role === Role.ADMIN) {
        redirect('/admin');
      } else if (userRole.role === Role.NASABAH) {
        redirect('/dashboard');
      } else if (userRole.role === Role.PEMERINTAH) {
        redirect('/statistics');
      } else if (userRole.role === Role.PERUSAHAAN) {
        redirect('/transactions');
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
  try {
    // Validate input using Zod schema
    const validatedData = validateRegister(formData);

    // For admin creation, verify that the request comes from an existing admin
    if (validatedData.role.toUpperCase() === Role.ADMIN) {
      const user = await validateSession();

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

    // Proceed with signup using our custom register function
    const result = await registerUser(
      validatedData.email,
      validatedData.password,
      validatedData.name,
      validatedData.role as Role,
    );

    if (!result.success) {
      return {
        error: result.error,
      };
    }

    revalidatePath('/', 'layout');
    redirect('/login?registered=true');
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
