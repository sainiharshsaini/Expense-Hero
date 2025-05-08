import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb"
    }
  },
  images: { // we did it 
    remotePatterns:[new URL('https://randomuser.me/api/portraits/**')]
  }
};

export default nextConfig;
