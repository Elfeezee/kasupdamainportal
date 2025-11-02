import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Added placehold.co for placeholder images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      }
      // If you add images from a new host (e.g., by providing your own image link),
      // you need to add its configuration here. For example:
      // {
      //   protocol: 'https',
      //   hostname: 'your-image-host.com', // Replace with the actual hostname
      //   port: '',
      //   pathname: '/**', // Or be more specific if needed
      // },
    ],
  },
};

export default nextConfig;
