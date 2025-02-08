"use client";

import React from "react";
import {
  ChevronsUpDownIcon,
  CornerDownLeftIcon,
  FileTextIcon,
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
  const { contains } = useFilter({ sensitivity: "base" });
  const [inputValue, setInputValue] = React.useState("");
  return (
    <SearchCommandDialog keyboardShortcut={keyboardShortcut} trigger={children}>
      <Command
        filter={contains}
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
    </SearchCommandDialog>
  );
}
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
