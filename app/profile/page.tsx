import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/app/utils/db';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Mail,
  Phone,
  Wallet,
  Scale,
  Building2,
  Globe,
} from 'lucide-react';

async function getData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }
  const profile = await prisma.userRole.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      companyProfile: true,
      timbangData: {
        include: {
          transaction: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5, // Get last 5 timbang records
      },
    },
  });

  if (!profile) {
    return notFound();
  }

  return {
    user,
    profile,
  };
}

export default async function ProfilePage() {
  const { profile } = await getData();

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Profile</CardTitle>
          <Badge variant="outline">{profile.role}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <Badge variant="secondary">{profile.role}</Badge>
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                {profile.email}
              </div>
              {profile.address && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {profile.address}
                </div>
              )}
            </div>
          </div>{' '}
          {/* Balance Info */}
          {(profile.role === 'NASABAH' || profile.role === 'PERUSAHAAN') && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">Balance</h3>
                  </div>
                  <p className="mt-2 text-2xl font-bold">
                    Rp {profile.saldo.toLocaleString('id-ID')}
                  </p>
                </CardContent>
              </Card>
              {profile.role === 'NASABAH' && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Timbang Value</h3>
                    </div>
                    <p className="mt-2 text-2xl font-bold">
                      Rp {profile.nilaiTimbang.toLocaleString('id-ID')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {/* Company Profile (if exists) */}{' '}
          {/* Recent Timbang History for NASABAH */}
          {profile.role === 'NASABAH' &&
            profile.timbangData &&
            profile.timbangData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Timbang History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.timbangData.map((data) => (
                    <div key={data.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{data.wasteType}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(data.createdAt).toLocaleDateString(
                              'id-ID',
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {data.weight.toFixed(1)} kg
                          </p>
                          <p className="text-sm text-emerald-500">
                            Rp {data.value.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          {/* Company Information */}
          {profile.companyProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">
                    {profile.companyProfile.companyName}
                  </h3>
                </div>
                {profile.companyProfile.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    {profile.companyProfile.phone}
                  </div>
                )}
                {profile.companyProfile.website && (
                  <div className="flex items-center text-muted-foreground">
                    <Globe className="mr-2 h-4 w-4" />
                    <a
                      href={profile.companyProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {profile.companyProfile.website}
                    </a>
                  </div>
                )}
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Accepted Waste Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.companyProfile.acceptedWasteTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Delivery Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Free delivery within {profile.companyProfile.deliveryRadius}
                    km
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Base fee: Rp{' '}
                    {profile.companyProfile.deliveryFeeBase.toLocaleString(
                      'id-ID',
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Additional fee: Rp{' '}
                    {profile.companyProfile.feePerKm.toLocaleString('id-ID')}/km
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
