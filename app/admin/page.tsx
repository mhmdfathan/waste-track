import { Metadata } from 'next';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your website content',
};

export default async function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your website content and settings
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
            <CardDescription>
              Manage static pages like Home, About, Contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/pages" className={buttonVariants()}>
              Manage Pages
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Create and manage blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/posts" className={buttonVariants()}>
              Manage Posts
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage blog categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/categories" className={buttonVariants()}>
              Manage Categories
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users" className={buttonVariants()}>
              Manage Users
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>
              View website analytics and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/statistics" className={buttonVariants()}>
              View Statistics
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
