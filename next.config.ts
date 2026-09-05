import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos d'illustration temporaires (Unsplash) en attendant les vraies photos de chantier du client.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
