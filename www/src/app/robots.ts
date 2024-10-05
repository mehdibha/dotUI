import { siteConfig } from "@/config/site-config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const domain = siteConfig.global.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${domain}/sitemap.xml`,
  };
}
