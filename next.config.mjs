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
    POSTGRES_URL: process.env.POSTGRES_URL,
  }
}

export default nextConfig
