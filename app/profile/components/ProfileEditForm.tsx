/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState, useRef } from 'react';
import { updateUserProfile } from '../actions';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { QrCode } from 'lucide-react';
import type { UserRoleWithRelations } from '@/types/auth';

interface ProfileEditFormProps {
  profile: UserRoleWithRelations;
  onUpdate: () => void;
}

export function ProfileEditForm({ profile, onUpdate }: ProfileEditFormProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    address: profile.address || '',
    qrisCode: profile.qrisCode || '',
    phone: profile.companyProfile?.phone || '',
    companyName: profile.companyProfile?.companyName || '',
    description: profile.companyProfile?.description || '',
    website: profile.companyProfile?.website || '',
    deliveryRadius: profile.companyProfile?.deliveryRadius || 50,
    deliveryFeeBase: profile.companyProfile?.deliveryFeeBase || 10000,
    feePerKm: profile.companyProfile?.feePerKm || 1000,
    acceptedWasteTypes: profile.companyProfile?.acceptedWasteTypes || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      toast.success('Profile updated successfully');
      onUpdate();
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `qris-${profile.userId}-${Date.now()}.${fileExt}`;
      const supabase = createClient();

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        throw new Error('Only JPEG, JPG and PNG files are allowed');
      }

      const { error: uploadError } = await supabase.storage
        .from('qris')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('qris')
        .getPublicUrl(fileName);

      handleChange('qrisCode', publicUrlData.publicUrl);
      toast.success('QRIS code image uploaded successfully');
    } catch (error) {
      console.error('Error uploading QRIS code:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error uploading QRIS code',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>

          {profile.role === 'NASABAH' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>QRIS Code Image</Label>
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center gap-4 pt-6">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="qrisUpload"
                    />
                    {formData.qrisCode ? (
                      <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg">
                        <Image
                          src={formData.qrisCode}
                          alt="QRIS Code"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="rounded-full bg-muted p-4">
                          <QrCode className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or JPEG (max. 5MB)
                        </p>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      onClick={() =>
                        document.getElementById('qrisUpload')?.click()
                      }
                    >
                      {uploading
                        ? 'Uploading...'
                        : formData.qrisCode
                        ? 'Change QRIS Code'
                        : 'Upload QRIS Code'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {profile.role === 'PERUSAHAAN' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      handleChange('companyName', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                  <Input
                    id="deliveryRadius"
                    type="number"
                    value={formData.deliveryRadius}
                    onChange={(e) =>
                      handleChange('deliveryRadius', parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryFeeBase">
                    Base Delivery Fee (Rp)
                  </Label>
                  <Input
                    id="deliveryFeeBase"
                    type="number"
                    value={formData.deliveryFeeBase}
                    onChange={(e) =>
                      handleChange('deliveryFeeBase', parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feePerKm">Fee per KM (Rp)</Label>
                  <Input
                    id="feePerKm"
                    type="number"
                    value={formData.feePerKm}
                    onChange={(e) =>
                      handleChange('feePerKm', parseInt(e.target.value))
                    }
                  />
                </div>
              </div>{' '}
              <div className="space-y-2">
                <Label>Accepted Waste Types</Label>
                <Select
                  value={formData.acceptedWasteTypes[0]}
                  onValueChange={(value) =>
                    handleChange('acceptedWasteTypes', [value])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RECYCLABLE">Recyclable</SelectItem>
                    <SelectItem value="NON_RECYCLABLE">
                      Non-Recyclable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
