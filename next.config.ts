import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "i.pcmag.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "platform.theverge.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**"
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default nextConfig
