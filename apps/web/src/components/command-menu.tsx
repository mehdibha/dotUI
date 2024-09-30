"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { FileIcon } from "lucide-react";
import { docsConfig } from "@/config/docs-config";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ui/default/core/command";
import { DialogRoot, Dialog } from "@/registry/ui/default/core/dialog";

export const CommandMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (pathname === "/") return;
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
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setIsOpen(false);
    command();
  }, []);

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setIsOpen}>
      {children}
      <Dialog className="!p-0">
        <Command>
          <CommandInput
            autoFocus
            placeholder="Search a component, a block, a hook..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {docsConfig.nav.map((category, index) => (
              <CommandGroup key={index} heading={category.title}>
                {category.items &&
                  category.items.map((item, itemIndex) => {
                    if ("href" in item && item.href) {
                      return (
                        <CommandItem
                          key={itemIndex}
                          onSelect={() => {
                            runCommand(() => router.push(item.href));
                          }}
                          className="flex items-center space-x-2"
                        >
                          <FileIcon className="size-4 text-fg-muted" />
                          <span>{item.title}</span>
                        </CommandItem>
                      );
                    }
                    if ("items" in item && item.items.length > 0) {
                      return (
                        <React.Fragment key={itemIndex}>
                          {item.items.map((subItem, subItemIndex) => {
                            return (
                              <CommandItem
                                key={subItemIndex}
                                onSelect={() => {
                                  runCommand(() => router.push(subItem.href));
                                }}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center space-x-2">
                                  <FileIcon className="size-4 text-fg-muted" />
                                  <span>{subItem.title}</span>
                                </div>
                                <div>
                                  <span className="text-secondary-foreground rounded-md border bg-bg-muted px-3 py-1 text-xs leading-none text-fg-muted">
                                    {item.title}
                                  </span>
                                  {subItem.label && (
                                    <span className="ml-2 rounded-md bg-gradient px-3 py-1 text-xs leading-none text-white">
                                      {subItem.label}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            );
                          })}
                        </React.Fragment>
                      );
                    }
                  })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </Dialog>
    </DialogRoot>
  );
};
