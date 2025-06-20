"use client";

import * as React from "react";
import {
  DropZone as AriaDropZone,
  Text as AriaText,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const dropZoneStyles = tv({
  slots: {
    dropzone:
      "drop-target:border-border-focus focus-visible:border-border-focus drop-target:bg-bg-accent-muted disabled:text-fg-disabled disabled:border-border-disabled flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm",
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
