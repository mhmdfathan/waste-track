'use client';

import { LoginForm } from '@/components/login-form';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace('/');
      }
    };
    checkAuth();
  }, [supabase.auth, router]);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    if (data?.user) {
      // First refresh to update server state
      router.refresh();
      // Then redirect to home page
      router.replace('/');
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
