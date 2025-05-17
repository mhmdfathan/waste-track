'use server';

import prisma from '@/app/utils/db';
import { createClient } from '@/lib/supabase/server';
import { WasteType } from '@prisma/client';

export async function updateUserProfile(data: {
  name: string;
  email: string;
  address: string;
  latitude?: number;
  longitude?: number;
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
    throw new Error('Not authenticated');
  }

  // Start a transaction to update both profile and company info if needed
  const result = await prisma.$transaction(async (tx) => {
    // Update user profile
    const updatedProfile = await tx.userRole.update({
      where: {
        userId: user.id,
      },
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      include: {
        companyProfile: true,
      },
    });

    // If user is a company and company data is provided, update company profile
    if (
      updatedProfile.role === 'PERUSAHAAN' &&
      updatedProfile.companyProfile &&
      (data.companyName ||
        data.phone ||
        data.description ||
        data.website ||
        data.deliveryRadius ||
        data.deliveryFeeBase ||
        data.feePerKm ||
        data.acceptedWasteTypes)
    ) {
      await tx.companyProfile.update({
        where: {
          userId: user.id,
        },
        data: {
          companyName: data.companyName,
          phone: data.phone,
          description: data.description,
          website: data.website,
          deliveryRadius: data.deliveryRadius,
          deliveryFeeBase: data.deliveryFeeBase,
          feePerKm: data.feePerKm,
          ...(data.acceptedWasteTypes && {
            acceptedWasteTypes: data.acceptedWasteTypes,
          }),
        },
      });
    }

    return updatedProfile;
  });

  return result;
}
