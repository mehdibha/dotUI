"use client";

import React from "react";
import { useDocsSearch } from "fumadocs-core/search/client";
import { SortedResult } from "fumadocs-core/server";
import { FileTextIcon, HashIcon, TextIcon } from "lucide-react";
import { kekabCaseToTitle } from "@/lib/string";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandRoot,
  CommandSeparator,
  type CommandRootProps,
} from "@/registry/ui/default/core/command";
import { cn } from "@/registry/ui/default/lib/cn";
import { searchConfig } from "@/config";

export const SearchCommand = ({
  className,
  animated,
  ...props
}: CommandRootProps & { animated?: boolean }) => {
  const { search, setSearch, query } = useDocsSearch();

  const results =
    search === "" || query.data === "empty"
      ? [
          {
            id: "suggestions",
            name: "Suggestions",
            results: searchConfig.defaultResults.map((elem) => ({
              id: elem.href,
              content: elem.name,
              url: elem.href,
              type: "page",
            })),
          },
        ]
      : groupByCategory(query.data);

  return (
    <CommandRoot
      shouldFilter={false}
      className={cn(
        // "dark:bg-[#151414]",
        animated && [
          "relative overflow-visible rounded-lg shadow-md",
          "after:animate-shine relative after:absolute after:-inset-px after:z-[-1] after:rounded-[inherit] after:bg-[linear-gradient(to_right,#343434_20%,#343434_40%,#707070_50%,#707070_55%,#343434_70%,#343434_100%)] after:bg-[250%_auto] after:content-['']",
          // we fake border
          "before:bg-border before:absolute before:-inset-px before:z-[-1] before:rounded-[inherit] before:content-['']",
        ],
        className
      )}
      {...props}
    >
      <CommandInput
        value={search}
        onValueChange={setSearch}
        autoFocus
        placeholder="Search a component, a block, a hook..."
        wrapperClassName={cn(animated && "border-b-0")}
      />
      {animated && (
        <CommandSeparator className="before:opacity-1 before:animate-loading before:delay-900 relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1/2 before:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0,#707070_50%,rgba(0,0,0,0)_100%)] before:opacity-0 before:content-['']" />
      )}
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>
        {results.map((group) => (
          <CommandGroup key={group.id} heading={group.name}>
            {group.results.map((item) => (
              <CommandItem key={item.id} value={item.id}>
                <div
                  className={cn(
                    "flex min-h-10 w-full flex-row items-center gap-3",
                    item.type !== "page" && "ms-2 gap-2 border-s ps-4"
                  )}
                >
                  <div className="text-fd-muted-foreground [&_svg]:size-4">
                    {icons[item.type as keyof typeof icons]}
                  </div>
                  <p className="w-0 flex-1 truncate">{item.content}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandRoot>
  );
};

type GroupedResults = {
  id: string;
  name: string;
  results: SortedResult[];
}[];
const groupByCategory = (results?: SortedResult[]): GroupedResults => {
  // We will get the category from the url and group the results by category
  // eg url: /docs/components/buttons/button -> category: components
  if (!results) return [];
  const uniqueCategories = Array.from(
    new Set(results.map((result) => result.url.split("/")[2]))
  );

  const groupedResults: GroupedResults = uniqueCategories.map((category) => ({
    id: category,
    name: kekabCaseToTitle(category),
    results: results.filter((result) => result.url.split("/")[2] === category),
  }));

  return groupedResults;
};

const icons = {
  text: <TextIcon />,
  heading: <HashIcon />,
  page: <FileTextIcon />,
};