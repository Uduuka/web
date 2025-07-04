import { type NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: "sqcidocbglgivrlysuhq.supabase.co",
        protocol: "https",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        hostname: "api.escuelajs.co",
        protocol: "https",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        hostname: "i.imgur.com",
        protocol: "https",
        port: "",
        pathname: "/**",
        search: "",
      },
      {
        hostname: "uduuka.com",
        protocol: "https",
        port: "",
        pathname: "/**",
        search: "",
      },
      
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
