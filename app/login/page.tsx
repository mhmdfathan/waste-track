'use client';

import { LoginForm } from '@/components/login-form';
import { createClient } from '@/lib/supabase/client';
import { login } from '@/app/login/actions';
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
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      return;
    }

    // The server action handles redirect on success
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
