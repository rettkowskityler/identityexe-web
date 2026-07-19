/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    allowedDevOrigins: ['192.168.0.140', 'localhost:3000'],
  },
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [
      {
        source: '/blog/:slug/li-:date',
        destination: '/blog/:slug',
      },
    ];
  },
}

module.exports = nextConfig
