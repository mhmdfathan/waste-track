/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { LoginForm } from '@/components/login-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { user, error, isLoading, login, checkSession, clearError, profile } =
    useAuthStore();

  useEffect(() => {
    // Check session on mount
    checkSession();

    // If user and profile exist, redirect to appropriate route
    if (user && profile) {
      router.replace('/');
    }

    return () => {
      clearError(); // Clear any errors when unmounting
    };
  }, [user, profile, router, checkSession, clearError]);

  async function handleLogin(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    clearError(); // Clear any previous errors
    await login(email, password);
  }

  if (isLoading) {
    return <div className="container max-w-lg mx-auto p-6">Loading...</div>;
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
