import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vjdobymdeayhwqorztnq.supabase.co',
      },
    ],
  },
};

export default nextConfig;
