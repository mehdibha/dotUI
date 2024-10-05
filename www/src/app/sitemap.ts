import { MetadataRoute } from "next";
import { allDocs } from "@/lib/docs";
import { siteConfig } from "@/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = siteConfig.global.url;

  return ["/", "/themes", ...allDocs.map((doc) => `/${doc._meta.path}`)].map(
    (path) => ({
      url: `${domain}${path}`,
      lastModified: new Date(),
    })
  );
}
