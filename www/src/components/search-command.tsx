import { SortedResult } from "fumadocs-core/server";
import { kekabCaseToTitle } from "@/lib/string";
import { source } from "@/app/source";
import { SearchCommandClient } from "./search-command-client";

const additionalPages = [
  {
    id: "themes",
    title: "Themes",
    headings: [],
    url: "/themes",
  },
];

export function SearchCommand() {
  const pages = [
    ...source.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      headings: page.data.structuredData.headings,
      url: page.url,
    })),
    ...additionalPages,
  ];

  const uniqueCategories = Array.from(
    new Set(pages.map((item) => item.url.split("/")[2]))
  ).filter(Boolean)

  const items = uniqueCategories.map((category) => ({
    title: kekabCaseToTitle(category),
    items: pages.filter((item) => item.url.split("/")[2] === category),
  }));

  return <SearchCommandClient items={items} />;
}
