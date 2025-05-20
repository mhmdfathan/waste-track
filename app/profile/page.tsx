'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { redirect } from 'next/navigation';
import ProfileContent from './components/ProfileContent';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { profile, user, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    if (!user) {
      checkSession();
    }
  }, [user, checkSession]);

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6 space-y-8">
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start space-x-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !profile) {
    redirect('/login');
  }

  // Validate that we have all necessary data based on role
  if (!profile.name || !profile.email || !profile.role) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profile Error</AlertTitle>
          <AlertDescription>
            Your profile data is incomplete. Please contact support for
            assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // For company accounts, ensure we have company profile data
  if (profile.role === 'PERUSAHAAN' && !profile.companyProfile) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Company Profile Error</AlertTitle>
          <AlertDescription>
            Your company profile data is missing. Please contact support for
            assistance.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <ProfileContent profile={profile} />;
}
