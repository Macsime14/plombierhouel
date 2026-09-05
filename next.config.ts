import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Photos d'illustration temporaires (Unsplash) en attendant les vraies photos de chantier du client.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  // Autorise le rechargement a chaud (HMR) quand le site est ouvert via l'IP locale plutot que localhost.
  allowedDevOrigins: ["192.168.1.34"],
};

export default nextConfig;
