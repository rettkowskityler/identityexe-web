/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.140', 'localhost:3000'],
  typescript: { ignoreBuildErrors: true },
}

module.exports = nextConfig
