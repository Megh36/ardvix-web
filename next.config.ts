import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/li",
        destination: "/?utm_source=linkedin&utm_medium=organic",
        permanent: false,
      },
      {
        source: "/wa",
        destination: "/?utm_source=whatsapp&utm_medium=dm",
        permanent: false,
      },
      {
        source: "/em",
        destination: "/?utm_source=email&utm_medium=signature",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
