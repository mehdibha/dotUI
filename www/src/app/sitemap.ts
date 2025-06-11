import type { MetadataRoute } from "next";
import { source } from "@/app/source";
import { siteConfig } from "@/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string =>
    new URL(path, siteConfig.url).toString();

  const pages = await Promise.all(
    source.getPages().map(async (page) => {
      const additionalProps = await page.data.load();
      return { ...additionalProps, ...page };
    }),
  );

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...pages.map<MetadataRoute.Sitemap[number]>((page) => ({
      url: url(page.url),
      lastModified: page.lastModified ? new Date(page.lastModified) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
