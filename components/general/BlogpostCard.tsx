import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  authorName: string;
  authorImage: string;
  createdAt: Date;
};

export function BlogPostCard({ data }: { data: BlogPost }) {
  return (
    <Link href={`/post/${data.id}`}>
      <div className="card bg-base-100 shadow-xl h-[400px] hover:shadow-2xl transition-shadow">
        <figure>
          <img
            src={data.imageUrl || 'https://picsum.photos/200/300'}
            alt={data.title}
            className="w-full h-48 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-lg font-bold line-clamp-1">
            {data.title}
          </h2>
          <p className="text-base-content/70 line-clamp-2">{data.content}</p>
          <div className="card-actions justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={data.authorImage || 'https://picsum.photos/200/300'}
                    alt={data.authorName}
                  />
                </div>
              </div>
              <span className="text-sm text-base-content/70">
                {data.authorName}
              </span>
            </div>
            <time className="text-xs text-base-content/60">
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              }).format(data.createdAt)}
            </time>
          </div>
        </div>
      </div>
    </Link>
  );
}
