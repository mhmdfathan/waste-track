'use client';

import { LoginForm } from '@/components/login-form';
import { supabase } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data?.user) {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="container max-w-lg mx-auto p-6">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      <LoginForm
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleLogin(formData);
        }}
      />
    </div>
  );
}
