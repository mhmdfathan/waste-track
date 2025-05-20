'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { redirect } from 'next/navigation';
import ProfileContent from './components/ProfileContent';

export default function ProfilePage() {
  const { profile, user, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    if (!user) {
      checkSession();
    }
  }, [user, checkSession]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !profile) {
    redirect('/login');
  }

  // Validate that we have all necessary data based on role
  if (!profile.name || !profile.email || !profile.role) {
    console.error('[Profile Page Debug] Incomplete profile data:', {
      hasName: !!profile.name,
      hasEmail: !!profile.email,
      hasRole: !!profile.role,
    });
    return <div>Profile data incomplete. Please contact support.</div>;
  }

  // For company accounts, ensure we have company profile data
  if (profile.role === 'PERUSAHAAN' && !profile.companyProfile) {
    console.error(
      '[Profile Page Debug] Company profile missing for company role',
    );
    return <div>Company profile data not found. Please contact support.</div>;
  }

  return <ProfileContent profile={profile} />;
}
