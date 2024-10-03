"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/ui/default/core/command";
import { Separator } from "@/registry/ui/default/core/separator";
import { cn } from "@/registry/ui/default/lib/cn";

export const CommandMenu = ({ className }: { className?: string }) => {
  // focus on render
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <Command
      className={cn(
        "relative overflow-visible rounded-lg bg-bg-muted shadow-md dark:bg-[#151414]",
        "relative after:absolute after:-inset-px after:z-[-1] after:animate-shine after:rounded-[inherit] after:bg-[linear-gradient(to_right,#343434_20%,#343434_40%,#707070_50%,#707070_55%,#343434_70%,#343434_100%)] after:bg-[250%_auto] after:content-['']",
        // we fake border
        "before:absolute before:-inset-px before:z-[-1] before:rounded-[inherit] before:bg-border before:content-['']",
        className
      )}
    >
      <CommandInput
        ref={inputRef}
        placeholder="Type a command or search..."
        wrapperClassName="border-b-0"
      />
      <Separator className="before:opacity-1 relative before:absolute before:left-0 before:top-0 before:h-full before:w-1/2 before:animate-loading before:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0,#707070_50%,rgba(0,0,0,0)_100%)] before:opacity-0 before:delay-900 before:content-['']" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Installation</span>
          </CommandItem>
          <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>CLI</span>
          </CommandItem>
          <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Button</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
