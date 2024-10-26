import { createSearchAPI } from "fumadocs-core/search/server";
import { source } from "@/app/source";

export const { GET } = createSearchAPI("advanced", {
  indexes: source.getPages().map((page) => ({
    title: page.data.title,
    structuredData: {
      headings: page.data.structuredData.headings,
      contents: [],
    },
    id: page.url,
    url: page.url,
  })),
});
