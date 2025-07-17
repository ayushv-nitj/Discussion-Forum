

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'], // allow Google/GitHub images
  },
};

module.exports = nextConfig;
