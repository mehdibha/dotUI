import { MetadataRoute } from "next";
import { source } from "@/app/source";
import { siteConfig } from "@/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string): string =>
    new URL(path, siteConfig.url).toString();

  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...source.getPages().map<MetadataRoute.Sitemap[number]>((page) => ({
      url: url(page.url),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
