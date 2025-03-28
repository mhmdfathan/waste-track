import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/general/Navbar';
import { AuthProvider } from '@/components/general/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Waste Track',
  description: 'Track your waste management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-base-100">
        <AuthProvider>
          <Navbar />
          <main className="container max-w-7xl mx-auto px-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
