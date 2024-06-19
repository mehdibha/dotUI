"use client";

import * as React from "react";
import {
  DropZone as AriaDropZone,
  Text as AriaText,
  type DropZoneProps as AriaDropZoneProps,
  type TextProps as AriaTextProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dropZoneStyles = tv({
  slots: {
    root: "flex flex-col p-6 w-full items-center justify-center gap-2 rounded-md border-2 border-dashed text-sm drop-target:border-border-focus focus-visible:border-border-focus drop-target:bg-bg-accent-muted disabled:text-fg-disabled disabled:border-border-disabled",
    label: "font-semibold text-md",
  },
});

interface DropZoneProps extends Omit<AriaDropZoneProps, "className"> {
  className?: string;
}
const DropZone = ({ className, ...props }: DropZoneProps) => {
  const { root } = dropZoneStyles();
  return <AriaDropZone className={root({ className })} {...props} />;
};

type DropZoneLabelProps = Omit<AriaTextProps, "slot">;
const DropZoneLabel = ({ className, ...props }: DropZoneLabelProps) => {
  const { label } = dropZoneStyles();
  return <AriaText slot="label" className={label({ className })} {...props} />;
};

export { DropZone, DropZoneLabel };
