/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['vkfbzrfveygdqsqyiggk.supabase.co', 'images.pexels.com']
  },
}

module.exports = nextConfig
