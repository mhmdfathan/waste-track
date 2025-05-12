import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/general/Navbar';
import { BottomNav } from '@/components/general/BottomNav';
import { AuthProvider } from '@/components/general/AuthProvider';
import { ThemeProvider } from '@/components/theme-provider';

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
    <AuthProvider>
      <html lang="en" suppressHydrationWarning style={{ overflowY: 'scroll' }}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} w-screen overflow-x-hidden min-h-screen`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1 pt-16">{children}</div>
              <BottomNav />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
