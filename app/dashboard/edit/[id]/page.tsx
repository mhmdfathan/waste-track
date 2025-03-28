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
import { prisma } from '@/app/utils/db';
import { notFound } from 'next/navigation';

type Params = {
  id: string;
};

export default async function EditBlogRoute({ params }: { params: Params }) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
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
              <Label>Title</Label>
              <Input
                name="title"
                required
                type="text"
                placeholder="Title"
                defaultValue={post.title}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              <Textarea
                name="content"
                required
                placeholder="Content"
                defaultValue={post.content}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Image URL</Label>
              <Input
                name="url"
                required
                type="url"
                placeholder="Image URL"
                defaultValue={post.imageUrl}
              />
            </div>
            <Submitbutton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
