import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const withAnalyzer = createBundleAnalyzer({
  enabled: false,
});

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: [
    "@dotui/api",
    "@dotui/auth",
    "@dotui/db",
    "@dotui/ui",
    "@dotui/validators",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ui.shadcn.com",
      },
    ],
  },
  devIndicators: {
    position: "bottom-right",
  },
};

export default withAnalyzer(withMDX(config));
