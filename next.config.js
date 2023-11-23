/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  swcMinify: true,
  experimental: {
    webpackBuildWorker: true,
  },
});

module.exports = {
  ...nextConfig,
  images: {
    domains: ['localhost'],
  },
};
