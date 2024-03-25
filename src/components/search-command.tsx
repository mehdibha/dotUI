import React from "react";
import { CircleIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { docsConfig } from "@/config/docs-config";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = (props: SearchDialogProps) => {
  const { open, onOpenChange } = props;
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search a component, a block, a hook..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {docsConfig.sidebarNav.map((category, index) => (
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
  );
};
