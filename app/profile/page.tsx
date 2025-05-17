import { getUserProfile } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileContent from './components/ProfileContent';

export default async function ProfilePage() {
  try {
    console.log('[Profile Page Debug] Attempting to get user profile');
    const profile = await getUserProfile();

    if (!profile) {
      console.log(
        '[Profile Page Debug] No profile found, redirecting to login',
      );
      redirect('/login');
    }

    // Validate that we have all necessary data based on role
    if (!profile.name || !profile.email || !profile.role) {
      console.error('[Profile Page Debug] Incomplete profile data:', {
        hasName: !!profile.name,
        hasEmail: !!profile.email,
        hasRole: !!profile.role,
      });
      throw new Error('Incomplete profile data');
    }

    // For company accounts, ensure we have company profile data
    if (profile.role === 'PERUSAHAAN' && !profile.companyProfile) {
      console.error(
        '[Profile Page Debug] Company profile missing for company role',
      );
      throw new Error('Company profile data not found');
    }

    console.log('[Profile Page Debug] Profile loaded successfully:', {
      role: profile.role,
      hasCompanyProfile: !!profile.companyProfile,
    });

    return <ProfileContent profile={profile} />;
  } catch (error) {
    console.error('[Profile Page Debug] Error loading profile:', error);
    redirect('/error');
  }
}
