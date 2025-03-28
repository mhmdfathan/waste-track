'use client';

import { useFormStatus } from 'react-dom';

export function Submitbutton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className="btn btn-primary w-full">
      {pending ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        'Submit'
      )}
    </button>
  );
}
