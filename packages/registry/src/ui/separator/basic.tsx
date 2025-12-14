"use client";

import {
  Separator as AriaSeparator,
  SeparatorContext as AriaSeparatorContext,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

const separatorStyles = tv({
  base: "separator shrink-0 border-0 bg-border",
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface SeparatorProps extends React.ComponentProps<typeof AriaSeparator> {}

const Separator = ({ orientation, className, ...props }: SeparatorProps) => {
  const ctx = useSlottedContext(AriaSeparatorContext);

  return (
    <AriaSeparator
      orientation={orientation}
      className={separatorStyles({
        orientation: orientation ?? ctx?.orientation,
        className,
      })}
      {...props}
    />
  );
};

export { Separator };
export type { SeparatorProps };
