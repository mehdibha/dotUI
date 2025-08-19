import { createMDX } from "fumadocs-mdx/next";
import { createJiti } from "jiti";

const withMDX = createMDX();

const jiti = createJiti(import.meta.url);

await jiti.import("./env");

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: ["@dotui/api", "@dotui/auth", "@dotui/db", "@dotui/ui"],
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/styles/:username/:stylename",
        destination:
          "/style-editor/colors?username=:username&stylename=:stylename",
      },
      {
        source: "/styles/:username/:stylename/layout",
        destination:
          "/style-editor/layout?username=:username&stylename=:stylename",
      },
      {
        source: "/styles/:username/:stylename/typography",
        destination:
          "/style-editor/typography?username=:username&stylename=:stylename",
      },
      {
        source: "/styles/:username/:stylename/components",
        destination:
          "/style-editor/components?username=:username&stylename=:stylename",
      },
      {
        source: "/styles/:username/:stylename/effects",
        destination:
          "/style-editor/effects?username=:username&stylename=:stylename",
      },
      {
        source: "/styles/:username/:stylename/icons",
        destination:
          "/style-editor/icons?username=:username&stylename=:stylename",
      },
    ];
  },
  experimental: {
    reactCompiler: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
      /require\.extensions is not supported by webpack/,
      {
        module: /node_modules\/cosmiconfig/,
      },
      {
        module: /node_modules\/shadcn/,
      },
      {
        module: /node_modules\/tsconfig-paths/,
      },
    ];
    return config;
  },
};

export default withMDX(config);
