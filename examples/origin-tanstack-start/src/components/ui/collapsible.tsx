"use client";

import type * as React from "react";
import * as ButtonPrimitives from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DisclosurePrimitives from "react-aria-components/Disclosure";
import { tv } from "tailwind-variants";

const collapsibleVariants = tv({
  slots: {
    root: "group/collapsible",
    trigger: "cursor-interactive focus-reset focus-visible:focus-ring",
    panel:
      "h-(--disclosure-panel-height) overflow-clip duration-200 ease-[cubic-bezier(0,0,0.58,1)] motion-safe:transition-[height]",
  },
});

const { root, trigger, panel } = collapsibleVariants();

/* -------------------------------------------------------------------------- */

interface CollapsibleProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

const Collapsible = ({ className, ...props }: CollapsibleProps) => {
  return (
    <DisclosurePrimitives.Disclosure
      data-collapsible=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CollapsibleTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

const CollapsibleTrigger = ({
  className,
  ...props
}: CollapsibleTriggerProps) => {
  return (
    <ButtonPrimitives.Button
      slot="trigger"
      data-collapsible-trigger=""
      className={composeRenderProps(className, (className) =>
        trigger({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface CollapsiblePanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

const CollapsiblePanel = ({ className, ...props }: CollapsiblePanelProps) => {
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-collapsible-panel=""
      className={composeRenderProps(className, (className) =>
        panel({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type {
  CollapsiblePanelProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
};
export { Collapsible, CollapsiblePanel, CollapsibleTrigger };
