'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { Role } from '@prisma/client'; // Import Role enum
import prisma from '@/app/utils/db'; // Corrected import path

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error: signInError, data: signInData } =
    await supabase.auth.signInWithPassword(data);

  if (signInError) {
    redirect('/error');
  }
  if (signInData.user) {
    // No need to check roles here since middleware handles access control
    revalidatePath('/', 'layout');
    return redirect('/');
  }

  // If we get here without a user, something went wrong
  return redirect('/error');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const roleInput = formData.get('role') as string;

  if (!email || !password || !roleInput) {
    return redirect('/error?message=Email, password, and role are required.');
  }

  // For admin creation, verify that the request comes from an existing admin
  if (roleInput.toUpperCase() === Role.ADMIN) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return redirect('/error?message=Unauthorized to create admin accounts');
    }

    const currentUserRole = await prisma.userRole.findUnique({
      where: { userId: user.id },
    });

    if (!currentUserRole || currentUserRole.role !== Role.ADMIN) {
      return redirect(
        '/error?message=Only existing admins can create new admin accounts',
      );
    }
  }

  // Validate roleInput against Role enum
  const selectedRole = roleInput.toUpperCase() as Role;
  if (!Object.values(Role).includes(selectedRole)) {
    return redirect(`/error?message=Invalid role selected: ${roleInput}`);
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error('Signup error:', signUpError.message);
    return redirect(
      `/error?message=${encodeURIComponent(signUpError.message)}`,
    );
  }

  const userId = signUpData.user?.id;
  if (userId) {
    try {
      const name = formData.get('name') as string;

      if (!name) {
        return redirect('/error?message=Name is required.');
      }

      await prisma.userRole.create({
        data: {
          userId: userId,
          role: selectedRole,
          name: name,
          email: email,
        },
      });
    } catch (roleError) {
      let errorMessage = 'An unknown error occurred while saving the role.';
      if (roleError instanceof Error) {
        errorMessage = roleError.message;
      }
      console.error('Role insert error (Prisma):', errorMessage);
      // Attempt to clean up the created user in Supabase auth if role insertion fails
      if (signUpData.user) {
        const { error: deleteUserError } = await supabase.auth.admin.deleteUser(
          signUpData.user.id,
        );
        if (deleteUserError) {
          console.error(
            'Failed to delete user after role insert error:',
            deleteUserError.message,
          );
        }
      }
      return redirect(
        `/error?message=Error saving role: ${encodeURIComponent(errorMessage)}`,
      );
    }
  }

  revalidatePath('/');
  redirect('/verify-email');
}
