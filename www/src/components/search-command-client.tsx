"use client";

import React from "react";
import {
  ChevronsUpDownIcon,
  CornerDownLeftIcon,
  FileTextIcon,
  HashIcon,
  SearchIcon,
} from "lucide-react";
import { useFilter } from "react-aria-components";
import { Button } from "@/components/core/button";
import { DialogRoot, Dialog } from "@/components/core/dialog";
import { MenuContent, MenuItem, MenuSection } from "@/components/core/menu";
import { SearchFieldRoot } from "@/components/core/search-field";
import { Command } from "@/registry/core/command_basic";
import { Input, InputRoot } from "@/registry/core/input_basic";

interface Heading {
  id: string;
  content: string;
}

interface Page {
  id: string;
  title: string;
  headings: Heading[];
  url: string;
}

interface SearchCommandClientProps {
  keyboardShortcut?: boolean;
  children: React.ReactNode;
  items: {
    title: string;
    items: Page[];
  }[];
}

export function SearchCommandClient({
  keyboardShortcut,
  children,
  items,
}: SearchCommandClientProps) {
  const [inputValue, setInputValue] = React.useState("");
  const filteredItems = React.useMemo(
    () => filterResults(inputValue, items),
    [inputValue, items]
  );

  return (
    <SearchCommandDialog keyboardShortcut={keyboardShortcut} trigger={children}>
      <Command
        inputValue={inputValue}
        onInputChange={setInputValue}
        className="h-72"
      >
        <div className="p-1">
          <SearchFieldRoot placeholder="Search" autoFocus className="w-full">
            <InputRoot className="focus-within:ring-1">
              <SearchIcon />
              <Input />
            </InputRoot>
          </SearchFieldRoot>
        </div>
        <MenuContent className="h-full overflow-y-scroll py-1">
          {filteredItems.map((category) => (
            <MenuSection key={category.id} title={category.title}>
              {category.items.map((item) => (
                <MenuItem
                  key={`${item.href}-${item.type}`}
                  href={item.href}
                  textValue={item.title}
                  prefix={item.type === "page" ? <FileTextIcon /> : undefined}
                  className={
                    item.type === "page"
                      ? "[&_svg]:text-fg-muted gap-3 py-2"
                      : "py-0 pl-2.5"
                  }
                >
                  {item.type === "page" ? (
                    item.title
                  ) : (
                    <div className="[&_svg]:text-fg-muted ml-2 flex items-center gap-3 border-l pl-4 [&_svg]:size-4">
                      <HashIcon />
                      <p className="flex-1 truncate py-2">{item.title}</p>
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

type FilteredItems = {
  title: string;
  href: string;
  type: "page" | "heading";
}[];

type FilteredResult = {
  id: string;
  title: string;
  items: FilteredItems;
}[];

const filterResults = (
  query: string,
  items: SearchCommandClientProps["items"]
): FilteredResult => {
  // When no query, return all pages without headings
  if (!query) {
    return items.map((category) => ({
      id: category.title,
      title: category.title,
      items: category.items.map((page) => ({
        title: page.title,
        href: page.url,
        type: "page",
      })),
    }));
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: FilteredResult = [];

  items.forEach((category) => {
    const matchedItems: FilteredItems = [];

    category.items.forEach((page) => {
      const isPageMatch = page.title.toLowerCase().includes(normalizedQuery);
      const matchedHeadings = page.headings.filter((heading) =>
        heading.content.toLowerCase().includes(normalizedQuery)
      );

      // Add page if title matches or if there are matched headings
      if (isPageMatch || matchedHeadings.length > 0) {
        matchedItems.push({
          title: page.title,
          href: page.url,
          type: "page",
        });
      }

      // Add matched headings after their parent page
      matchedHeadings.forEach((heading) => {
        matchedItems.push({
          title: heading.content,
          href: `${page.url}#${heading.id}`,
          type: "heading",
        });
      });
    });

    // Only add categories that have matches
    if (matchedItems.length > 0) {
      results.push({
        id: category.title,
        title: category.title,
        items: matchedItems,
      });
    }
  });

  return results;
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
