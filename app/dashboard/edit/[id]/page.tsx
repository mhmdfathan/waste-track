import { editPost } from '@/app/actions';
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
import prisma from '@/app/utils/db';
import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>;

export default async function IdPage({ params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }
  const listing = await prisma.wasteListing.findUnique({
    where: { id },
  });
  if (!listing) {
    notFound();
  }

  async function editAction(formData: FormData) {
    'use server';
    await editPost(formData, id);
  }

  return (
    <div>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Edit Listing</CardTitle>
          <CardDescription>Edit your waste listing</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" action={editAction}>
            <div className="flex flex-col gap-2">
              <Label>Title</Label>{' '}
              <Input
                name="title"
                required
                type="text"
                placeholder="Title"
                defaultValue={listing.title}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                name="content"
                required
                placeholder="Description"
                defaultValue={listing.description}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Price (IDR)</Label>
              <Input
                name="price"
                required
                type="number"
                min="0"
                placeholder="Price"
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
                placeholder="Weight"
                defaultValue={listing.weight}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Waste Type</Label>{' '}
              <select
                name="wasteType"
                required
                defaultValue={listing.wasteType}
                className="form-select rounded-md border p-2"
              >
                <option value="RECYCLABLE">Recyclable</option>
                <option value="NON_RECYCLABLE">Non-Recyclable</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Image URL</Label>
              <Input
                name="url"
                required
                type="url"
                placeholder="Image URL"
                defaultValue={listing.imageUrl}
              />
            </div>
            <Submitbutton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
