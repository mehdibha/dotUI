"use client";

import React from "react";
import { CircleIcon, SearchIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/lib/components/core/default/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/lib/components/core/default/command";
import { cn } from "@/lib/utils/classes";
import { docsConfig } from "@/config/docs-config";

export const SearchDocs = (props: ButtonProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        {...props}
        className={cn("w-full px-2 text-sm text-muted-foreground", props.className)}
      >
        <SearchIcon size={18} className="mr-1.5" />
        <span className="mr-4 flex-1 text-left">Quick Search...</span>
        <span className="rounded-md bg-card px-1 py-0.5 text-xs">Ctrl K</span>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search a component, a block, a hook..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {docsConfig.nav.map((category, index) => (
            <CommandGroup key={index} heading={category.title}>
              {category.items.map((item, itemIndex) => {
                if ("href" in item && item.href) {
                  return (
                    <CommandItem key={itemIndex} className="flex items-center space-x-2">
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
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <CircleIcon />
                              <span>{subItem.title}</span>
                            </div>
                            <div>
                              <span className="rounded-md bg-secondary px-3 py-1 text-xs leading-none text-black text-secondary-foreground">
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
      </CommandDialog>
    </>
  );
};
