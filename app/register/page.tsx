'use client';

import { signup } from '@/app/login/actions';
import { useState } from 'react';
import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container max-w-lg mx-auto p-6">
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      <RegisterForm
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          try {
            await signup(formData);
          } catch {
            setError('Registration failed. Please try again.');
          }
        }}
      />
    </div>
  );
}
