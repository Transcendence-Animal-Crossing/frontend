/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
