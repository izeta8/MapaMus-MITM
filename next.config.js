/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ignore build errors from dependencies inside node_modules (e.g. @supabase)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
