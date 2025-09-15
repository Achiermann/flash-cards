import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(process.cwd(), 'src');
    return config;
  },
};

export default nextConfig;