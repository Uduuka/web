import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
        protocol: "https",
        port: "",
        pathname: "/600x400/**",
        search: "",
      },
      {
        hostname: "placehold.co",
        protocol: "https",
        port: "",
        pathname: "/400x400/**",
        search: "",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
