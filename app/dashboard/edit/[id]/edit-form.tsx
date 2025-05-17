'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/utils';
import { editPost } from '@/app/actions';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Link from 'next/link';
import { Submitbutton } from '@/components/general/Submitbutton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WasteListing } from '@prisma/client';
import { toast } from 'sonner';

type EditFormProps = {
  listing: WasteListing;
  id: string;
};

export function EditForm({ listing, id }: EditFormProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(listing.imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        throw new Error('Only JPEG, JPG and PNG files are allowed');
      }

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      setImageUrl(publicUrlData.publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(
        error instanceof Error ? error.message : 'Error uploading image',
      );
    } finally {
      setUploading(false);
    }
  }

  async function editAction(formData: FormData) {
    try {
      formData.set('url', imageUrl);
      await editPost(formData, id);
      toast.success('Listing updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error updating listing',
      );
      throw error;
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
          <CardDescription>Update your waste listing details</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-6" action={editAction}>
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input
                name="title"
                required
                type="text"
                placeholder="Enter listing title"
                defaultValue={listing.title}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                name="content"
                required
                placeholder="Describe your waste listing in detail"
                className="min-h-[100px]"
                defaultValue={listing.description}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Price (IDR)</Label>
                <Input
                  name="price"
                  required
                  type="number"
                  min="0"
                  placeholder="Enter price in Rupiah"
                  defaultValue={listing.price}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Weight (kg)</Label>
                <Input
                  name="weight"
                  required
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Enter weight in kg"
                  defaultValue={listing.weight}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Waste Type</Label>
              <select
                name="wasteType"
                required
                defaultValue={listing.wasteType}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select waste type</option>
                <option value="RECYCLABLE">Recyclable</option>
                <option value="NON_RECYCLABLE">Non-Recyclable</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Image</Label>
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-4 pt-6">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  {imageUrl ? (
                    <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg">
                      <Image
                        src={imageUrl}
                        alt="Listing Image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="rounded-full bg-muted p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground"
                        >
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                          <line x1="16" x2="22" y1="5" y2="5" />
                          <line x1="19" x2="19" y1="2" y2="8" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
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
                      document.getElementById('imageUpload')?.click()
                    }
                  >
                    {uploading
                      ? 'Uploading...'
                      : imageUrl
                      ? 'Change Image'
                      : 'Choose Image'}
                  </Button>
                </CardContent>
              </Card>
              <input type="hidden" name="url" value={imageUrl} />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Submitbutton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
