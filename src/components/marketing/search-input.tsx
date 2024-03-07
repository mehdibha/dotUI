"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/classes";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ containerProps, className, ...props }, ref) => {
    const { className: containerClassName, ...restContainerProps } = containerProps ?? {};

    return (
      <div
        className={cn(
          "flex items-center rounded-full border bg-card/80 px-3",
          containerClassName
        )}
        {...restContainerProps}
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          className={cn(
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "Input";
