import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "dotUI",
    short_name: "dotui",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#010101",
    theme_color: "#010101",
    icons: [
      {
        src: "https://dotui.org/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
