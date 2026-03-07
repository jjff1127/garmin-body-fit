/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Necesario para que @garmin/fitsdk funcione en el cliente
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig
