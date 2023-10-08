/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
      domains: ['vkfbzrfveygdqsqyiggk.supabase.co']
  },
}

module.exports = nextConfig
