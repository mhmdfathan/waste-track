import { getUserProfile } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileContent from './components/ProfileContent';

export default async function ProfilePage() {
  try {
    console.log('[Profile Page Debug] Attempting to get user profile');
    const profile = await getUserProfile();

    if (!profile) {
      console.log(
        '[Profile Page Debug] No authenticated user or profile found, redirecting to login',
      );
      return redirect('/login');
    }

    // Validate that we have all necessary data based on role
    if (!profile.name || !profile.email || !profile.role) {
      console.error('[Profile Page Debug] Incomplete profile data:', {
        hasName: !!profile.name,
        hasEmail: !!profile.email,
        hasRole: !!profile.role,
      });
      return redirect('/error?message=incomplete_profile');
    }

    // For company accounts, ensure we have company profile data
    if (profile.role === 'PERUSAHAAN' && !profile.companyProfile) {
      console.error(
        '[Profile Page Debug] Company profile missing for company role',
      );
      return redirect('/error?message=missing_company_profile');
    }

    console.log('[Profile Page Debug] Profile loaded successfully:', {
      role: profile.role,
      hasCompanyProfile: !!profile.companyProfile,
    });

    return <ProfileContent profile={profile} />;
  } catch (error) {
    console.error('[Profile Page Debug] Error loading profile:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      throw error; // Let Next.js handle the redirect
    }
    return redirect('/error?message=profile_load_error');
  }
}
