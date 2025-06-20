"use client";

import React from "react";
import { Separator as AriaSeparator } from "react-aria-components";
import { tv } from "tailwind-variants";

const separatorStyles = tv({
  base: "bg-border separator shrink-0 border-0",
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
  return (
    <AriaSeparator
      className={separatorStyles({ orientation, className })}
      {...props}
    />
  );
};

export { Separator };
