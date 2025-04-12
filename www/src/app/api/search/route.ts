import { createSearchAPI } from "fumadocs-core/search/server";
import { source } from "@/app/source";

const additionalPages = [
  {
    title: "Themes",
    url: "/themes",
  },
];

export const { GET } = createSearchAPI("advanced", {
  indexes: [
    ...source.getPages().map((page) => ({
      title: page.data.title,
      structuredData: {
        headings: [],
        // headings: page.data.structuredData.headings,
        contents: [],
      },
      id: page.url,
      url: page.url,
    })),
    ...additionalPages.map((page) => ({
      title: page.title,
      structuredData: {
        headings: [],
        contents: [],
      },
      id: page.url,
      url: page.url,
    })),
  ],
});
