/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 代理到后端API
  async rewrites() {
    return [
      {
        source: '/api/:path*',        // 前端请求 /api/xxx
        destination: 'http://localhost:3333/api/:path*', // 代理到后端 NestJS
      },
    ];
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
