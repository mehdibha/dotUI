"use client";

// This compnoent is not ready for production use. It is a work in progress.
import React from "react";
import { avatarStyles } from "@/registry/ui/default/core/avatar";
import { cn } from "@/registry/ui/default/lib/cn";

type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  max?: number;
  total?: number;
  shape?: "circle" | "square";
  renderCount?: (count: number) => React.ReactNode;
  countProps?: React.HTMLAttributes<HTMLSpanElement>;
};

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children: children_,
      max = 5,
      className,
      total,
      shape,
      renderCount,
      countProps,
      ...props
    },
    ref
  ) => {
    const clampedMax = max < 2 ? 2 : max;
    const children = React.Children.toArray(children_).filter((child) => {
      return React.isValidElement(child);
    }) as React.ReactElement[];
    const totalCount = total ?? children.length;
    const avatarsToShow =
      totalCount <= clampedMax ? clampedMax : clampedMax - 1;
    const extraCount = totalCount - avatarsToShow;

    return (
      <div
        ref={ref}
        {...props}
        className={cn("*:ring *:ring-bg flex -space-x-2", className)}
      >
        {children.slice(0, avatarsToShow).map((child) => {
          return React.cloneElement(child, {
            shape,
          });
        })}
        {extraCount > 1 && (
          <span
            ref={ref}
            className={cn(
              avatarStyles({ shape }).root(),
              "items-center justify-center bg-bg-muted text-sm text-fg-muted"
            )}
            {...countProps}
          >
            {renderCount ? renderCount(extraCount) : `+${extraCount}`}
          </span>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup };
