import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'blocks.astratic.com',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'lh3.googleusercontent.com',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'images.tokopedia.net',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'encrypted-tbn0.gstatic.com',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'static.vecteezy.com',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'gejtvuoxjvysjozrhwms.supabase.co',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'asoytfhhdelgxjbmqekh.supabase.co',
        protocol: 'https',
        port: '',
      },
      {
        hostname: 'example.com',
        protocol: 'https',
        port: '',
      },
    ],
  },
};

export default nextConfig;
