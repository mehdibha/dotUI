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
  reactCompiler: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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

export default withMDX(config);
