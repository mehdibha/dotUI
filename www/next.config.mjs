import { createMDX } from "fumadocs-mdx/next";
import { createJiti } from "jiti";

const withMDX = createMDX();

const jiti = createJiti(import.meta.url);

await jiti.import("./env");

/** @type {import("next").NextConfig} */
const config = {
  transpilePackages: [
    "@dotui/api",
    "@dotui/auth",
    "@dotui/db",
    "@dotui/registry",
  ],
  typedRoutes: true,
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
