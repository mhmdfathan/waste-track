'use server';

import prisma from '@/app/utils/db';
import { createClient } from '@/lib/supabase/server';
import { WasteType } from '@prisma/client';
import { updateUserSchema } from '../schemas/user';
import { updateCompanyProfileSchema } from '../schemas/company';

export async function updateUserProfile(rawData: {
  name: string;
  email: string;
  address: string;
  latitude?: number;
  longitude?: number;
  qrisCode?: string;
  phone?: string;
  companyName?: string;
  description?: string;
  website?: string;
  deliveryRadius?: number;
  deliveryFeeBase?: number;
  feePerKm?: number;
  acceptedWasteTypes?: WasteType[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  try {
    // Validate user profile data
    const validatedUserData = updateUserSchema.safeParse({
      name: rawData.name,
      email: rawData.email,
      address: rawData.address,
      latitude: rawData.latitude,
      longitude: rawData.longitude,
      qrisCode: rawData.qrisCode,
    });

    if (!validatedUserData.success) {
      return {
        error:
          validatedUserData.error.errors[0]?.message || 'Invalid user data',
      };
    }

    // Start a transaction to update both profile and company info if needed
    const result = await prisma.$transaction(async (tx) => {
      // Update user profile
      const updatedProfile = await tx.userRole.update({
        where: {
          userId: user.id,
        },
        data: validatedUserData.data,
        include: {
          companyProfile: true,
        },
      });

      // If user is a company and company data is provided, update company profile
      if (
        updatedProfile.role === 'PERUSAHAAN' &&
        updatedProfile.companyProfile &&
        (rawData.companyName ||
          rawData.phone ||
          rawData.description ||
          rawData.website ||
          rawData.deliveryRadius ||
          rawData.deliveryFeeBase ||
          rawData.feePerKm ||
          rawData.acceptedWasteTypes)
      ) {
        // Validate company profile data
        const validatedCompanyData = updateCompanyProfileSchema.safeParse({
          companyName: rawData.companyName,
          phone: rawData.phone,
          description: rawData.description,
          website: rawData.website,
          deliveryRadius: rawData.deliveryRadius,
          deliveryFeeBase: rawData.deliveryFeeBase,
          feePerKm: rawData.feePerKm,
          acceptedWasteTypes: rawData.acceptedWasteTypes,
        });

        if (!validatedCompanyData.success) {
          throw new Error(
            validatedCompanyData.error.errors[0]?.message ||
              'Invalid company data',
          );
        }

        await tx.companyProfile.update({
          where: {
            userId: user.id,
          },
          data: validatedCompanyData.data,
        });
      }

      return updatedProfile;
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      error:
        error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}
