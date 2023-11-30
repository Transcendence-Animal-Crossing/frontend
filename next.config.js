/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost', 'backend', 'ec2-43-201-205-34.ap-northeast-2.compute.amazonaws.com'],
  },
};

module.exports = nextConfig;
