"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator";
import * as ToggleButtonPrimitives from "react-aria-components/ToggleButton";
import * as ToggleButtonGroupPrimitives from "react-aria-components/ToggleButtonGroup";
import { tv } from "tailwind-variants";

const segmentedControlVariants = tv({
  slots: {
    root: "inline-flex w-fit items-center justify-center rounded-md text-fg-muted orientation-vertical:flex-col orientation-vertical:items-stretch bg-muted p-[3px]",
    item: "relative isolate inline-flex cursor-interactive items-center justify-center rounded-[calc(var(--radius-md)-3px)] border border-transparent whitespace-nowrap transition-[color] outline-none select-ui focus-visible:focus-ring text-fg-muted hover:text-fg disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor) **:[svg]:pointer-events-none **:[svg]:shrink-0 gap-2 px-4 py-2.5 text-base has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5 **:[svg]:not-with-[size]:size-5 selected:text-fg-inverse disabled:selected:text-(--disabled-selected-fg,var(--color-fg-inverse)) font-bold",
    indicator:
      "pointer-events-none absolute top-0 left-0 size-full rounded-[calc(var(--radius-md)-3px)] transition-[translate,width,height] motion-reduce:transition-none bg-inverse in-disabled:bg-(--disabled-selected-bg,var(--color-inverse))",
    itemContent: "relative z-10 inline-flex items-center gap-[inherit]",
  },
});

const { root, item, indicator, itemContent } = segmentedControlVariants();

/* -------------------------------------------------------------------------- */

interface SegmentedControlProps extends Omit<
  React.ComponentProps<typeof ToggleButtonGroupPrimitives.ToggleButtonGroup>,
  "selectionMode"
> {}

const SegmentedControl = ({ className, ...props }: SegmentedControlProps) => {
  return (
    <ToggleButtonGroupPrimitives.ToggleButtonGroup
      data-segmented-control=""
      selectionMode="single"
      disallowEmptySelection
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface SegmentedControlItemProps extends React.ComponentProps<
  typeof ToggleButtonPrimitives.ToggleButton
> {}

const SegmentedControlItem = ({
  className,
  children,
  ...props
}: SegmentedControlItemProps) => {
  return (
    <ToggleButtonPrimitives.ToggleButton
      data-segmented-control-item=""
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          <SelectionIndicatorPrimitives.SelectionIndicator
            data-segmented-control-indicator=""
            className={indicator()}
          />
          <span data-segmented-control-content="" className={itemContent()}>
            {children}
          </span>
        </>
      ))}
    </ToggleButtonPrimitives.ToggleButton>
  );
};

/* -------------------------------------------------------------------------- */

export type { SegmentedControlItemProps, SegmentedControlProps };
export { SegmentedControl, SegmentedControlItem };
