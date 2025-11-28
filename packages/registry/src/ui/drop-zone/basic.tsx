"use client";

import {
  DropZone as AriaDropZone,
  Text as AriaText,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

const dropZoneStyles = tv({
  slots: {
    dropzone:
      "flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 drop-target:border-border-focus border-dashed drop-target:bg-accent-muted p-6 text-sm focus-visible:border-border-focus disabled:border-border-disabled disabled:text-fg-disabled",
    label: "text-base",
  },
});

const { dropzone, label } = dropZoneStyles();

interface DropZoneProps extends React.ComponentProps<typeof AriaDropZone> {}
const DropZone = ({ className, ...props }: DropZoneProps) => {
  return (
    <AriaDropZone
      className={composeRenderProps(className, (className) =>
        dropzone({ className }),
      )}
      {...props}
    />
  );
};

interface DropZoneLabelProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}
const DropZoneLabel = ({ className, ...props }: DropZoneLabelProps) => {
  return <AriaText slot="label" className={label({ className })} {...props} />;
};

export type { DropZoneProps, DropZoneLabelProps };
export { DropZone, DropZoneLabel };
