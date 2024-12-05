"use client";

import * as React from "react";
import {
  composeRenderProps,
  DropZone as AriaDropZone,
  type DropZoneProps as AriaDropZoneProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dropZoneStyles = tv({
  slots: {
    root: "drop-target:border-border-focus focus-visible:border-border-focus drop-target:bg-bg-accent-muted disabled:text-fg-disabled disabled:border-border-disabled flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm",
    label: "text-md font-semibold",
  },
});

type DropZoneProps = AriaDropZoneProps;
const DropZone = (props: DropZoneProps) => {
  const { root } = dropZoneStyles();
  return (
    <AriaDropZone
      {...props}
      className={composeRenderProps(props.className, (className) =>
        root({ className })
      )}
    />
  );
};

export type { DropZoneProps };
export { DropZone };
