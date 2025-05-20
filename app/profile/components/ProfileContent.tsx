'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type {
  CompanyProfile,
  TimbangData,
  UserRole,
  WasteType,
} from '@prisma/client';
import {
  MapPin,
  Mail,
  Phone,
  Wallet,
  Scale,
  Building2,
  Globe,
  BadgeCheck,
} from 'lucide-react';
import { ProfileEditForm } from './ProfileEditForm';
import { ScrollArea } from '@/components/ui/scroll-area';

type CompanyProfileWithWasteTypes = CompanyProfile & {
  acceptedWasteTypes: WasteType[];
};

type UserRoleWithRelations = UserRole & {
  companyProfile: CompanyProfileWithWasteTypes | null;
  timbangData: TimbangData[];
};

export default function ProfileContent({
  profile,
}: {
  profile: UserRoleWithRelations;
}) {
  const handleProfileUpdate = async () => {
    window.location.reload();
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Profile</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage your profile information
            </p>
          </div>
          <ProfileEditForm profile={profile} onUpdate={handleProfileUpdate} />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24 border-2">
              <AvatarFallback className="text-2xl bg-primary/5">
                {profile.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <Badge
                  variant={
                    profile.role === 'ADMIN'
                      ? 'destructive'
                      : profile.role === 'PERUSAHAAN'
                      ? 'default'
                      : 'secondary'
                  }
                  className="ml-2"
                >
                  {profile.role}
                </Badge>
              </div>
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
          </div>

          <Separator />

          {/* Balance Info */}
          {(profile.role === 'NASABAH' || profile.role === 'PERUSAHAAN') && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Balance</h3>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-primary">
                    Rp {profile.saldo.toLocaleString('id-ID')}
                  </p>
                </CardContent>
              </Card>
              {profile.role === 'NASABAH' && (
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                      <Scale className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Timbang Value</h3>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-primary">
                      Rp {profile.nilaiTimbang.toLocaleString('id-ID')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Recent Timbang History for NASABAH */}
          {profile.role === 'NASABAH' &&
            profile.timbangData &&
            profile.timbangData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Recent Timbang History
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="h-[400px]">
                  <CardContent className="space-y-4">
                    {profile.timbangData.map((data: TimbangData) => (
                      <div
                        key={data.id}
                        className="border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              <Badge variant="outline">{data.wasteType}</Badge>
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(data.createdAt).toLocaleDateString(
                                'id-ID',
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {data.weight.toFixed(1)} kg
                            </p>
                            <p className="text-sm font-medium text-primary">
                              Rp {data.value.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </ScrollArea>
              </Card>
            )}

          {/* Company Information */}
          {profile.companyProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Company Details
                    </h4>
                    <div className="space-y-2">
                      <p className="font-medium text-lg">
                        {profile.companyProfile.companyName}
                      </p>
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
                            className="hover:text-primary transition-colors"
                          >
                            {profile.companyProfile.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Accepted Waste Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.companyProfile.acceptedWasteTypes.map(
                        (type: string) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <BadgeCheck className="h-3 w-3" />
                            {type.toLowerCase().replace('_', ' ')}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Delivery Information
                    </h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Delivery Radius
                        </span>
                        <span className="font-medium">
                          {profile.companyProfile.deliveryRadius} km
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Base Delivery Fee
                        </span>
                        <span className="font-medium">
                          Rp{' '}
                          {profile.companyProfile.deliveryFeeBase.toLocaleString(
                            'id-ID',
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Additional Fee per KM
                        </span>
                        <span className="font-medium">
                          Rp{' '}
                          {profile.companyProfile.feePerKm.toLocaleString(
                            'id-ID',
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
