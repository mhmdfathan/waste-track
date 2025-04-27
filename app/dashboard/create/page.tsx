'use client';

import { useRef, useState } from 'react';
import { supabase } from '@/lib/utils';
import { handleSubmission } from '@/app/actions';
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
import { v4 as uuidv4 } from "uuid";

export default function CreateBlogRoute() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('images') // Make sure you have an 'images' bucket in Supabase
      .upload(fileName, file);
    if (error) {
      alert('Error uploading image');
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    setImageUrl(publicUrlData.publicUrl);
    setUploading(false);
  }

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!imageUrl) {
      e.preventDefault();
      alert('Please upload an image first.');
    }
  }

  return (
    <div>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Create Listing</CardTitle>
          <CardDescription>Create a new listing for your waste</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            action={handleSubmission}
            onSubmit={handleFormSubmit}
          >
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input name="title" required type="text" placeholder="Title" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Price</Label>
              <Input name="content" required placeholder="Price" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                required
                disabled={uploading}
              />
              {uploading && <span>Uploading...</span>}
              {imageUrl && (
                <img src={imageUrl} alt="Uploaded" className="max-h-32 mt-2" />
              )}
              <input type="hidden" name="url" value={imageUrl} />
            </div>
            <Submitbutton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
