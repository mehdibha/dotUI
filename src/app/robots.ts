import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/account/",
    },

    sitemap: "https://vapi.tn/sitemap.xml",
  };
}
