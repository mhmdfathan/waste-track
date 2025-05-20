/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';
import { loginSchema, registerSchema } from '../schemas/auth';

export function validateLogin(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const result = loginSchema.safeParse({
    email,
    password,
  });

  if (!result.success) {
    const errors = result.error.flatten();
    throw new Error(Object.values(errors.fieldErrors).flat().join(', '));
  }

  return result.data;
}

export function validateRegister(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');
  const name = formData.get('name');
  const role = formData.get('role');
  const address = formData.get('address');

  const result = registerSchema.safeParse({
    email,
    password,
    name,
    role,
    address,
  });

  if (!result.success) {
    const errors = result.error.flatten();
    throw new Error(Object.values(errors.fieldErrors).flat().join(', '));
  }

  return result.data;
}
