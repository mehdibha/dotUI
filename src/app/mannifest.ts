import type { MetadataRoute } from "next";
import { siteConfig } from "@/config";

const config = siteConfig.global;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: config.name,
    short_name: config.name,
    description: config.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
    ],
  };
}
