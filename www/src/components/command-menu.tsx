"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FileIcon } from "lucide-react";
import { docsConfig } from "@/config/docs-config";
import {
  CommandRoot,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  type CommandRootProps,
  type CommandInputProps,
  type CommandSeparatorProps,
} from "@/registry/ui/default/core/command";
import { DialogRoot, Dialog } from "@/registry/ui/default/core/dialog";
import { cn } from "@/registry/ui/default/lib/cn";

export const CommandMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
      {children}
      <Dialog className="!p-0">
        <CommandMenuRoot>
          <CommandMenuInput />
          <CommandMenuContent runCommand={runCommand} />
        </CommandMenuRoot>
      </Dialog>
    </DialogRoot>
  );
};

export const CommandMenuRoot = ({ className, ...props }: CommandRootProps) => {
  return (
    <CommandRoot className={cn("dark:bg-[#151414]", className)} {...props} />
  );
};

export const CommandMenuInput = React.forwardRef<
  React.ElementRef<typeof CommandInput>,
  CommandInputProps
>((props, ref) => {
  return (
    <CommandInput
      ref={ref}
      autoFocus
      placeholder="Search a component, a block, a hook..."
      {...props}
    />
  );
});

CommandMenuInput.displayName = "CommandMenuInput";

export const CommandMenuSeparator = (props: CommandSeparatorProps) => {
  return <CommandSeparator {...props} />;
};

export const CommandMenuContent = ({
  runCommand = (command: () => unknown) => {
    command();
  },
}: {
  runCommand?: (command: () => unknown) => void;
}) => {
  const router = useRouter();
  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      {docsConfig.nav.map((category, index) => (
        <CommandGroup key={index} heading={category.title}>
          {category.items &&
            category.items.map((item, itemIndex) => {
              if ("href" in item && typeof item.href === "string") {
                return (
                  <CommandItem
                    key={itemIndex}
                    onSelect={() => {
                      runCommand(() => router.push(item.href));
                    }}
                    className="flex items-center space-x-2"
                  >
                    <FileIcon className="text-fg-muted size-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                );
              }
              if ("items" in item && item.items && item.items.length > 0) {
                return (
                  <React.Fragment key={itemIndex}>
                    {item.items.map((subItem, subItemIndex) => {
                      if ("href" in subItem && subItem.href !== undefined) {
                        return (
                          <CommandItem
                            key={subItemIndex}
                            onSelect={() => {
                              runCommand(() => router.push(subItem.href));
                            }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <FileIcon className="text-fg-muted size-4" />
                              <span>{subItem.title}</span>
                            </div>
                            <div>
                              <span className="text-secondary-foreground bg-bg-muted text-fg-muted rounded-md border px-3 py-1 text-xs leading-none">
                                {item.title}
                              </span>
                              {subItem.label && (
                                <span className="bg-gradient ml-2 rounded-md px-3 py-1 text-xs leading-none text-white">
                                  {subItem.label}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        );
                      }
                    })}
                  </React.Fragment>
                );
              }
            })}
        </CommandGroup>
      ))}
    </CommandList>
  );
};
