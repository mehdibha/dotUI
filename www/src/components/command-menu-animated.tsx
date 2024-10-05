"use client";

import React from "react";
import { useCommandMenuInputRef } from "@/hooks/use-focus-command-menu";
import { cn } from "@/registry/ui/default/lib/cn";
import {
  CommandMenuRoot,
  CommandMenuInput,
  CommandMenuContent,
  CommandMenuSeparator,
} from "./command-menu";

export const CommandMenu = ({ className }: { className?: string }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { setInputRef } = useCommandMenuInputRef();

  React.useEffect(() => {
    setInputRef(inputRef);
  }, [setInputRef]);

  // focus on shortcut
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
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // focus on render
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <CommandMenuRoot
      className={cn(
        "relative h-60 overflow-visible rounded-lg shadow-md",
        "after:animate-shine relative after:absolute after:-inset-px after:z-[-1] after:rounded-[inherit] after:bg-[linear-gradient(to_right,#343434_20%,#343434_40%,#707070_50%,#707070_55%,#343434_70%,#343434_100%)] after:bg-[250%_auto] after:content-['']",
        // we fake border
        "before:bg-border before:absolute before:-inset-px before:z-[-1] before:rounded-[inherit] before:content-['']",
        className
      )}
    >
      <CommandMenuInput ref={inputRef} wrapperClassName="border-b-0" />
      <CommandMenuSeparator className="before:opacity-1 before:animate-loading before:delay-900 relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1/2 before:bg-[linear-gradient(90deg,rgba(0,0,0,0)_0,#707070_50%,rgba(0,0,0,0)_100%)] before:opacity-0 before:content-['']" />
      <CommandMenuContent />
    </CommandMenuRoot>
  );
};
