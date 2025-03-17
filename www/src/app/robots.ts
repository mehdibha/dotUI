import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";

export default function robots(): MetadataRoute.Robots {
  const domain = siteConfig.url;

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
