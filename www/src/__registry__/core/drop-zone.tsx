"use client";

import * as React from "react";
import {
  DropZone as AriaDropZone,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dropZoneStyles = tv({
  base: "drop-target:border-border-focus focus-visible:border-border-focus drop-target:bg-bg-accent-muted disabled:text-fg-disabled disabled:border-border-disabled flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm",
});

interface DropZoneProps extends React.ComponentProps<typeof AriaDropZone> {}
const DropZone = ({ className, ...props }: DropZoneProps) => {
  return (
    <AriaDropZone
      className={composeRenderProps(className, (className) =>
        dropZoneStyles({ className })
      )}
      {...props}
    />
  );
};

export type { DropZoneProps };
export { DropZone };
