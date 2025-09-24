// next.config.mjs
import path from 'node:path';
import withPWA from '@ducanh2912/next-pwa';

const withPWACfg = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // SW only in prod
  // Minimal, safe runtime caching (tweak later if you like)
  runtimeCaching: [
    // HTML/navigation requests
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: { cacheName: 'pages', networkTimeoutSeconds: 3 }
    },
    // JS/CSS/workers
    {
      urlPattern: ({ request }) =>
        ['script', 'style', 'worker'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'assets' }
    },
    // Images
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'images' }
    },
    // Your Next API routes
    {
      urlPattern: /^\/api\/.*$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-local',
        networkTimeoutSeconds: 3,
        cacheableResponse: { statuses: [0, 200] }
      }
    }
  ]
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(process.cwd(), 'src');
    return config;
  },
};

export default withPWACfg(nextConfig);
