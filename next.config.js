/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['vkfbzrfveygdqsqyiggk.supabase.co', 'images.pexels.com', 'picsum.photos']
  },
}

module.exports = nextConfig
