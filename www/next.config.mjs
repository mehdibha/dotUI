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
    ],
  },
  devIndicators: {
    appIsrStatus: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // experimental: {
  //   reactCompiler: true,
  // },
};

export default withMDX(config);
