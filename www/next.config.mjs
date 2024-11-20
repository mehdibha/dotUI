import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/docs/getting-started/introduction",
        permanent: true,
      },
    ];
  },
};

export default withMDX(config);
