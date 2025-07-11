import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/general/Navbar';
import { BottomNav } from '@/components/general/BottomNav';
import { ThemeProvider } from '@/components/theme-provider';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Trash It',
  description: 'Created by Jagoan Timbang',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ overflowY: 'scroll' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 pt-24 pb-20">
            <Suspense>{children}</Suspense>
          </main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
