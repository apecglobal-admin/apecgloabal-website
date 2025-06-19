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
  },
  experimental: {
    serverComponentsExternalPackages: ['pg'],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        dns: false,
        net: false,
        tls: false,
        child_process: false,
      };
      
      // Ignore pg-native and other problematic modules in client-side builds
      config.resolve.alias = {
        ...config.resolve.alias,
        'pg-native': false,
        'pg-cloudflare': false,
        'cloudflare:sockets': false,
      };
    }
    return config;
  },
}

export default nextConfig
