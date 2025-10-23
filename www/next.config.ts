import { createMDX } from "fumadocs-mdx/next";
import { createJiti } from "jiti";
import type { NextConfig } from "next";

const jiti = createJiti(import.meta.url);

await jiti.import("./env");

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@dotui/api",
    "@dotui/auth",
    "@dotui/db",
    "@dotui/registry",
  ],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  typedRoutes: true,
  serverExternalPackages: [
    "ts-morph",
    "typescript",
    "oxc-transform",
    "twoslash",
    "shiki",
    "@takumi-rs/core",
  ],
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

  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/styles/:username/:stylename",
        destination:
          "/style-editor/colors?username=:username&stylename=:stylename",
      },
      {
        source:
          "/styles/:username/:stylename/:section(colors|layout|typography|components|effects|icons)",
        destination:
          "/style-editor/:section?username=:username&stylename=:stylename",
      },
    ];
  },
};


export default config
