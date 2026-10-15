"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator";
import * as ToggleButtonPrimitives from "react-aria-components/ToggleButton";
import * as ToggleButtonGroupPrimitives from "react-aria-components/ToggleButtonGroup";
import { tv } from "tailwind-variants";

const segmentedControlVariants = tv({
  slots: {
    root: "inline-flex w-fit items-center justify-center rounded-lg text-fg-muted bg-muted p-[3px]",
    item: "relative isolate inline-flex cursor-default items-center justify-center rounded-[calc(var(--radius-lg)-3px)] border border-transparent whitespace-nowrap focus-reset transition-[color] select-ui focus-visible:focus-ring-outside text-fg-muted hover:text-fg disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor) aria-disabled:cursor-disabled aria-disabled:text-(--disabled-fg,currentColor) **:[svg]:pointer-events-none **:[svg]:shrink-0 gap-1.5 px-2.5 py-1 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 **:[svg]:not-with-[size]:size-4 selected:text-fg-on-selected font-medium",
    indicator:
      "pointer-events-none absolute inset-0 rounded-[calc(var(--radius-lg)-3px)] transition-[translate,width,height] motion-reduce:transition-none bg-selected shadow-sm",
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
      data-slot="segmented-control"
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
      data-slot="segmented-control-item"
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {/* React Aria's SelectionIndicator: it tracks the selected item and
              animates its translate/width/height, so the pill slides smoothly. */}
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
