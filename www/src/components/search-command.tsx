"use client";

import React from "react";
import { useDocsSearch } from "fumadocs-core/search/client";
import type { SortedResult } from "fumadocs-core/server";
import {
  ChevronsUpDownIcon,
  CornerDownLeftIcon,
  FileTextIcon,
  HashIcon,
  SearchIcon,
} from "lucide-react";
import { kekabCaseToTitle } from "@/lib/string";
import { Button } from "@/components/core/button";
import { Command } from "@/components/core/command";
import { DialogRoot, Dialog } from "@/components/core/dialog";
import { Input, InputRoot } from "@/components/core/input";
import { Loader } from "@/components/core/loader";
import { MenuContent, MenuItem, MenuSection } from "@/components/core/menu";
import { SearchFieldRoot } from "@/components/core/search-field";

interface SearchCommandProps {
  keyboardShortcut?: boolean;
  children: React.ReactNode;
  onAction?: () => void;
}

export function SearchCommand({
  keyboardShortcut,
  children,
  onAction,
}: SearchCommandProps) {
  const { search, setSearch, query } = useDocsSearch({ type: "fetch" });
  const results =
    search === "" || query.data === "empty" ? [] : groupByCategory(query.data);

  return (
    <SearchCommandDialog keyboardShortcut={keyboardShortcut} trigger={children}>
      <Command inputValue={search} onInputChange={setSearch} className="h-72">
        <div className="p-1">
          <SearchFieldRoot placeholder="Search" autoFocus className="w-full">
            <InputRoot className="focus-within:ring-1">
              {query.isLoading ? <Loader /> : <SearchIcon />}
              <Input />
            </InputRoot>
          </SearchFieldRoot>
        </div>
        <MenuContent
          onAction={() => {
            setSearch("");
            onAction?.();
          }}
          className="h-full overflow-y-scroll py-1"
        >
          {results.map((group) => (
            <MenuSection key={group.id} title={group.name}>
              {group.results.map((item) => (
                <MenuItem
                  key={item.id}
                  href={item.url}
                  textValue={item.content}
                  prefix={item.type === "page" ? <FileTextIcon /> : undefined}
                  className={
                    item.type === "page"
                      ? "[&_svg]:text-fg-muted gap-3 py-2"
                      : "py-0 pl-2.5"
                  }
                >
                  {item.type === "page" ? (
                    item.content
                  ) : (
                    <div className="[&_svg]:text-fg-muted ml-2 flex items-center gap-3 border-l pl-4 [&_svg]:size-4">
                      <HashIcon />
                      <p className="flex-1 truncate py-2">{item.content}</p>
                    </div>
                  )}
                </MenuItem>
              ))}
            </MenuSection>
          ))}
        </MenuContent>
        <div className="text-fg-muted flex items-center justify-end gap-4 rounded-b-[inherit] border-t p-3 text-xs [&_svg]:size-4">
          <div className="flex items-center gap-1">
            <ChevronsUpDownIcon />
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <CornerDownLeftIcon />
            <span>Go</span>
          </div>
        </div>
      </Command>
    </SearchCommandDialog>
  );
}

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
    new Set(results.map((result) => result.url.split("/")[2]!))
  ).filter(Boolean);

  const groupedResults: GroupedResults = uniqueCategories.map((category) => ({
    id: category,
    name: kekabCaseToTitle(category),
    results: results.filter((result) => result.url.split("/")[2] === category),
  }));

  return groupedResults;
};

const SearchCommandDialog = ({
  keyboardShortcut = false,
  trigger,
  children,
}: {
  keyboardShortcut?: boolean;
  children: React.ReactNode;
  trigger: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!keyboardShortcut) return;

    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [keyboardShortcut]);

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setIsOpen}>
      {trigger}
      <Dialog className="p-0!">
        {children}
        <Button
          slot="close"
          variant="outline"
          shape="rectangle"
          size="sm"
          className="absolute right-2 top-2 h-7 px-2 text-xs font-normal"
        >
          Esc
        </Button>
      </Dialog>
    </DialogRoot>
  );
};
