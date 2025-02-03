"use client";

import React from "react";
import {
  ChevronsUpDownIcon,
  CornerDownLeftIcon,
  FileTextIcon,
  SearchIcon,
} from "lucide-react";
import { useFilter } from "react-aria-components";
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
  items: {
    title: string;
    items: Page[];
  }[];
}

export function SearchCommandClient({ items }: SearchCommandClientProps) {
  const { contains } = useFilter({ sensitivity: "base" });
  const [inputValue, setInputValue] = React.useState("");
  return (
    <Command
      filter={contains}
      inputValue={inputValue}
      onInputChange={setInputValue}
      className="h-72"
    >
      <div className="p-1 pb-0">
        <SearchFieldRoot placeholder="Search" autoFocus className="w-full">
          <InputRoot className="focus-within:ring-1">
            <SearchIcon />
            <Input />
          </InputRoot>
        </SearchFieldRoot>
      </div>
      <MenuContent items={items} className="h-full overflow-y-scroll py-1">
        {items.map((category, categoryIndex) => (
          <MenuSection key={categoryIndex} title={category.title}>
            {category.items.map((page) => (
              <React.Fragment key={page.id}>
                <MenuItem
                  href={page.url}
                  textValue={page.title}
                  prefix={<FileTextIcon />}
                  className="py-2"
                >
                  {page.title}
                </MenuItem>
              </React.Fragment>
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
  );
}
