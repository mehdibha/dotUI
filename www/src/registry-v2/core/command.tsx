"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "@/__icons__";
import { cn } from "@/registry-v2/lib/cn";

type CommandRootProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive>;
const CommandRoot = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  CommandRootProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "bg-bg text-fg flex h-full w-full flex-col overflow-hidden rounded-md",
      className
    )}
    {...props}
  />
));
CommandRoot.displayName = CommandPrimitive.displayName;

type CommandInputProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Input
> & {
  wrapperClassName?: string;
  icon?: React.ReactNode;
};
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  CommandInputProps
>(({ className, wrapperClassName, icon, ...props }, ref) => (
  <div
    className={cn("flex items-center gap-2 border-b px-3", wrapperClassName)}
    cmdk-input-wrapper=""
  >
    {icon || <SearchIcon className="size-4 shrink-0" />}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "placeholder:text-fg-muted outline-hidden flex h-11 w-full rounded-md bg-transparent py-3 text-base disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

type CommandListProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.List
>;
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  CommandListProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

type CommandEmptyProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Empty
>;
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  CommandEmptyProps
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

type CommandGroupProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Group
>;
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  CommandGroupProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "text-fg [&_[cmdk-group-heading]]:text-fg-muted overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

type CommandSeparatorProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Separator
>;
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(
      "bg-border separator h-px w-full shrink-0 border-0",
      className
    )}
    // className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

type CommandItemProps = React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Item
>;
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "aria-selected:bg-bg-muted aria-selected:text-fg outline-hidden relative flex h-10 cursor-pointer select-none items-center rounded-sm px-2 text-sm transition-colors",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

type CommandShortcutProps = React.HTMLAttributes<HTMLSpanElement>;
const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => {
  return (
    <span
      className={cn("text-fg-muted ml-auto text-xs tracking-widest", className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  CommandRoot,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

export type {
  CommandRootProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandSeparatorProps,
  CommandItemProps,
  CommandShortcutProps,
};
