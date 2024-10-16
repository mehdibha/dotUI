"use client";

import * as React from "react";
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const separatorStyles = tv({
  base: "bg-border separator shrink-0 border-0",
  variants: {
    orientation: {
      horizontal: "h-[1px] w-full",
      vertical: "h-full w-[1px]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorProps = AriaSeparatorProps;
const Separator = ({ orientation, className, ...props }: SeparatorProps) => {
  return (
    <AriaSeparator
      {...props}
      className={separatorStyles({ orientation, className })}
    />
  );
};

export { Separator };
