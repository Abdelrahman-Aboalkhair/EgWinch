import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = bundleAnalyzer({
  images: {
    domains: ["lh3.googleusercontent.com", "res.cloudinary.com"],
  },
});

export default nextConfig;
