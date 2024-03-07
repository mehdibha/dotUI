/** @type {import("next").NextConfig} */
const config = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint:{
    ignoreDuringBuilds: true
  },
};

export default config;
