/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  turbopack: {
    resolveAlias: {
      canvas: './empty-module.ts',
      encoding: './empty-module.ts',
    },
  },
};

export default nextConfig;
