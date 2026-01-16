/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'apecgloabal-website.vercel.app'],
  },
  env: {
    POSTGRES_URL: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    DATABASE_URL: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/cms/login',
          destination: '/api/auth/login',
        },
        {
          source: '/cms/sidebars',
          destination: '/api/auth/sidebars',
        },
        {
          source: '/cms/profile',
          destination: '/api/auth/profile',
        },
        {
          source: '/cms/logout',
          destination: '/api/auth/logout',
        },
        {
          source: '/cms/validate',
          destination: '/api/auth/validate',
        },
      ],
    };
  },
}

export default nextConfig
