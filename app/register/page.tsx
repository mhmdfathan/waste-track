'use client';

import { signup } from '@/app/login/actions';
import { useState } from 'react';
import { RegisterForm } from '@/components/register-form';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="container max-w-lg mx-auto p-6">
      <RegisterForm
        error={error}
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const result = await signup(formData);

          if (result?.error) {
            setError(result.error);
            return;
          }
          // The server action handles redirect on success
        }}
      />
    </div>
  );
}
