import type { NextConfig } from "next";

process.loadEnvFile("../.env");
const apiUrl = process.env.DJANGO_PUBLIC_API_URL;
console.log(apiUrl);
const nextConfig: NextConfig = {
  env: {
    DJANGO_PUBLIC_API_URL: apiUrl,
  },
};

export default nextConfig;
