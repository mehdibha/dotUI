"use client";

import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";
const markerVariants = tv({
  slots: {
    root: [
      "group/marker relative flex w-full items-center text-left text-fg-muted",
      "**:[a]:underline **:[a]:underline-offset-3 **:[a]:hover:text-fg",
      "min-h-4 gap-2 text-sm **:[svg]:not-with-[size]:size-4",
    ],
    icon: ["shrink-0", "size-4"],
    content: [
      "min-w-0 wrap-break-word",
      "group-data-[variant=separator]/marker:flex-none group-data-[variant=separator]/marker:text-center",
    ],
  },
  variants: {
    variant: {
      default: {},
      separator: {
        root: "before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
      },
      border: {
        root: ["border-b", "pb-2"],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface MarkerProps extends React.ComponentProps<"div"> {
  variant?: "default" | "separator" | "border";
}

const Marker = ({ className, variant = "default", ...props }: MarkerProps) => {
  const { root } = markerVariants({ variant });
  return (
    <div
      data-marker=""
      data-variant={variant}
      className={root({ className })}
      {...props}
    />
  );
};

interface MarkerIconProps extends React.ComponentProps<"span"> {}

const MarkerIcon = ({ className, ...props }: MarkerIconProps) => {
  const { icon } = markerVariants();
  return (
    <span
      data-marker-icon=""
      aria-hidden="true"
      className={icon({ className })}
      {...props}
    />
  );
};

interface MarkerContentProps extends React.ComponentProps<"span"> {}

const MarkerContent = ({ className, ...props }: MarkerContentProps) => {
  const { content } = markerVariants();
  return (
    <span
      data-marker-content=""
      className={content({ className })}
      {...props}
    />
  );
};

export type { MarkerContentProps, MarkerIconProps, MarkerProps };
export { Marker, MarkerContent, MarkerIcon };
