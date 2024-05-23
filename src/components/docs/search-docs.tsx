"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { CircleIcon, SearchIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/lib/components/core/default/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/lib/components/core/default/command";
import { DialogRoot, Dialog } from "@/lib/components/core/default/dialog";
import { cn } from "@/lib/utils/classes";
import { docsConfig } from "@/config/docs-config";

export const SearchDocs = (props: ButtonProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
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
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setIsOpen(false);
    command();
  }, []);

  return (
    <DialogRoot isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        prefix={<SearchIcon />}
        suffix={
          <span className="rounded-md bg-bg-muted px-1 py-0.5 text-xs">Ctrl K</span>
        }
        {...props}
        className={cn("w-full px-2 text-sm text-fg-muted", props.className)}
      >
        {/* <span className="mr-4 flex-1 text-left">Quick Search...</span> */}
        <span> Quick Search...</span>
      </Button>
      <Dialog>
        <Command>
          <CommandInput placeholder="Search a component, a block, a hook..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {docsConfig.nav.map((category, index) => (
              <CommandGroup key={index} heading={category.title}>
                {category.items.map((item, itemIndex) => {
                  if ("href" in item && item.href) {
                    return (
                      <CommandItem
                        key={itemIndex}
                        onSelect={() => {
                          runCommand(() => router.push(item.href));
                        }}
                        className="flex items-center space-x-2"
                      >
                        <CircleIcon />
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
                                <CircleIcon />
                                <span>{subItem.title}</span>
                              </div>
                              <div>
                                <span className="rounded-md bg-bg-muted px-3 py-1 text-xs leading-none text-black text-secondary-foreground">
                                  {item.title}
                                </span>
                                {subItem.label && (
                                  <span className="ml-2 rounded-md bg-gradient px-3 py-1 text-xs leading-none text-black">
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
