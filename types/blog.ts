import { PostStatus } from '@prisma/client';

interface Author {
  userId: string;
  name: string;
  image?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  imageUrl: string;
  status: PostStatus;
  authorId: string;
  categoryId: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
  category: Category;
}
