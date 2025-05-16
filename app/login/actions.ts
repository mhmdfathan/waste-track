'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

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
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', signInData.user.id)
      .single();

    if (roleError) {
      console.error('Error fetching role:', roleError.message);
      // Handle error, e.g., redirect to an error page or proceed without role
    }

    // You can now use roleData?.role
    // For example, store it in a session or redirect based on role
    if (roleData?.role) {
      console.log('User role:', roleData.role);
      // Example: redirect based on role
      // switch (roleData.role) {
      //   case 'nasabah':
      //     redirect('/dashboard/nasabah');
      //     break;
      //   case 'perusahaan':
      //     redirect('/dashboard/perusahaan');
      //     break;
      //   case 'pemerintah':
      //     redirect('/dashboard/pemerintah');
      //     break;
      //   default:
      //     redirect('/');
      // }
    }
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string; // Get role

  if (!email || !password || !role) {
    return redirect('/error?message=Email, password, and role are required.');
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Store role in user_metadata if you still want it there for quick client-side access
      // data: {
      //   role: role,
      // },
    },
  });

  if (signUpError) {
    console.error('Signup error:', signUpError.message);
    return redirect(
      `/error?message=${encodeURIComponent(signUpError.message)}`,
    );
  }

  const userId = signUpData.user?.id;

  if (userId) {
    const { error: roleError } = await supabase
      .from('user_roles') // Make sure this matches your table name in Prisma schema
      .insert([{ user_id: userId, role: role }]);

    if (roleError) {
      console.error('Role insert error:', roleError.message);
      // Optionally, handle this error, e.g., by deleting the user or redirecting to an error page
      return redirect(
        `/error?message=Error saving role: ${encodeURIComponent(
          roleError.message,
        )}`,
      );
    }
  }

  redirect('/verify-email'); // Redirect to verify email page
}
