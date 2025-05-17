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
import { useEffect, useState } from 'react';
import { updateUserProfile } from '../actions';
import { toast } from 'sonner';

interface ProfileEditFormProps {
  profile: any; // Replace with proper type
  onUpdate: () => void;
}

export function ProfileEditForm({ profile, onUpdate }: ProfileEditFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    address: profile.address || '',
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
              </div>

              <div className="space-y-2">
                <Label>Accepted Waste Types</Label>
                <Select
                  value={formData.acceptedWasteTypes}
                  onValueChange={(value) =>
                    handleChange('acceptedWasteTypes', value)
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
