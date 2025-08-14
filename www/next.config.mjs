import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";
import { createJiti } from "jiti";

const withMDX = createMDX();

const withAnalyzer = createBundleAnalyzer({
  enabled: false,
});

const jiti = createJiti(import.meta.url);

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
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
        source: "/styles/:username/:styleName",
        destination: "/style-editor/colors",
      },
      {
        source: "/styles/:username/:styleName/layout",
        destination: "/style-editor/layout",
      },
      {
        source: "/styles/:username/:styleName/typography",
        destination: "/style-editor/typography",
      },
      {
        source: "/styles/:username/:styleName/components",
        destination: "/style-editor/components",
      },
      {
        source: "/styles/:username/:styleName/effects",
        destination: "/style-editor/effects",
      },
      {
        source: "/styles/:username/:styleName/icons",
        destination: "/style-editor/icons",
      },
    ];
  },
  // experimental: {
  //   reactCompiler: true,
  // },
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

export default withAnalyzer(withMDX(config));
