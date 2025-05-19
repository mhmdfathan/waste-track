import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const prisma = new PrismaClient();

async function createAdminUser() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  try {
    // Create user in Supabase directly as admin
    const { data: authUser, error: createError } =
      await supabase.auth.admin.createUser({
        email: 'admin@admin.com',
        password: 'password',
        email_confirm: true,
      });

    if (createError) {
      throw createError;
    }

    if (!authUser.user) {
      throw new Error('Failed to create auth user');
    }

    // Create admin profile in Prisma
    const adminProfile = await prisma.userRole.create({
      data: {
        userId: authUser.user.id,
        email: 'admin@admin.com',
        name: 'Admin User',
        role: 'ADMIN',
        saldo: 0,
        nilaiTimbang: 0,
        address: '',
      },
    });

    console.log('Successfully created admin user:', {
      email: adminProfile.email,
      role: adminProfile.role,
      userId: adminProfile.userId,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser().catch(console.error);
