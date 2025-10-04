"use client";

import React from "react";
import {
  ArrowRightIcon,
  ChevronsUpDownIcon,
  CircleDashedIcon,
  CornerDownLeftIcon,
  FileTextIcon,
  SearchIcon,
} from "lucide-react";
import { composeRenderProps, useFilter } from "react-aria-components";
import type { PageTree } from "fumadocs-core/server";
import type { Route } from "next";

import { Button } from "@dotui/registry/ui/button";
import { Command } from "@dotui/registry/ui/command";
import { Dialog, DialogRoot } from "@dotui/registry/ui/dialog";
import { Input, InputRoot } from "@dotui/registry/ui/input";
import { MenuContent, MenuItem, MenuSection } from "@dotui/registry/ui/menu";
import { SearchFieldRoot } from "@dotui/registry/ui/search-field";

interface SearchCommandProps {
  items: PageTree.Node[];
  keyboardShortcut?: boolean;
  children: React.ReactNode;
  onAction?: () => void;
}

export function SearchCommand({
  items,
  keyboardShortcut,
  children,
  onAction,
}: SearchCommandProps) {
  const [search, setSearch] = React.useState("");
  const { contains } = useFilter({ sensitivity: "base" });

  return (
    <SearchCommandDialog keyboardShortcut={keyboardShortcut} trigger={children}>
      <Command filter={contains} className="h-72">
        <div className="p-1">
          <SearchFieldRoot
            placeholder="Search"
            autoFocus
            value={search}
            onChange={setSearch}
            className="w-full"
          >
            <InputRoot className="focus-within:ring-1">
              <SearchIcon />
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
          <MenuSection title="Menu">
            {(
              [
                {
                  label: "Docs",
                  href: "/docs",
                },
                {
                  label: "Components",
                  href: "/docs/components/button",
                },
                {
                  label: "Blocks",
                  href: "/blocks",
                },
                {
                  label: "Styles",
                  href: "/styles",
                },
              ] as const
            ).map((item) => (
              <MenuItem
                key={item.href}
                href={item.href}
                textValue={item.label}
                prefix={<ArrowRightIcon className="text-fg-muted!" />}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuSection>
          {items?.map((group, index) => {
            if (group.type === "folder") {
              return (
                <MenuSection title={group.name} key={index}>
                  {group.children.map((item, itemIndex) => {
                    if (item.type === "page") {
                      return (
                        <MenuItem
                          key={itemIndex}
                          href={item.url as Route}
                          textValue={item.name as string}
                          prefix={
                            group.name === "Components" ? (
                              <CircleDashedIcon className="text-fg-muted!" />
                            ) : (
                              <FileTextIcon className="text-fg-muted!" />
                            )
                          }
                        >
                          {item.name}
                        </MenuItem>
                      );
                    }
                    return null;
                  })}
                </MenuSection>
              );
            }
            return null;
          })}
        </MenuContent>
        <div className="flex items-center justify-end gap-4 rounded-b-[inherit] border-t p-3 text-xs text-fg-muted [&_svg]:size-4">
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
  trigger: React.ReactNode;
} & React.ComponentProps<typeof Dialog>) => {
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
      <Dialog
        className="p-0!"
        modalProps={{
          className: "duration-0 entering:scale-100 exiting:scale-100",
          overlayClassName:
            "duration-0 entering:opacity-100 exiting:opacity-100 backdrop-blur-[2px]",
        }}
      >
        {composeRenderProps(children, (children) => (
          <>
            {children}
            <Button
              slot="close"
              variant="default"
              shape="rectangle"
              size="sm"
              className="absolute top-2 right-2 h-7 px-2 text-xs font-normal"
            >
              Esc
            </Button>
          </>
        ))}
      </Dialog>
    </DialogRoot>
  );
};
