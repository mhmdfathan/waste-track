import { handleSubmission } from '@/app/actions';
import { Submitbutton } from '@/components/general/Submitbutton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreateBlogRoute() {
  return (
    <div className="py-8">
      <div className="max-w-lg mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create Post</h2>
            <p className="text-base-content/70">
              Create a new post to share with the world
            </p>

            <form
              className="flex flex-col gap-4 mt-4"
              action={handleSubmission}
            >
              <div className="form-control w-full">
                <Label>Title</Label>
                <Input name="title" required type="text" placeholder="Title" />
              </div>

              <div className="form-control w-full">
                <Label>Content</Label>
                <Textarea name="content" required placeholder="Content" />
              </div>

              <div className="form-control w-full">
                <Label>Image URL</Label>
                <Input name="url" required type="url" placeholder="Image URL" />
              </div>

              <Submitbutton />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
