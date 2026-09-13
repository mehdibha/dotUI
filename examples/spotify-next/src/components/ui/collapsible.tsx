"use client";

import * as ButtonPrimitives from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DisclosurePrimitives from "react-aria-components/Disclosure";
import { tv } from "tailwind-variants";

const collapsibleVariants = tv({
  slots: {
    root: "group/collapsible",
    trigger: "cursor-interactive focus-reset focus-visible:focus-ring",
    panel:
      "h-(--disclosure-panel-height) overflow-clip opacity-0 duration-300 ease-fluid-out group-expanded/collapsible:opacity-100 motion-safe:transition-[height,opacity]",
  },
});

const { root, trigger, panel } = collapsibleVariants();

/* -------------------------------------------------------------------------- */

interface CollapsibleProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

function Collapsible({ className, ...props }: CollapsibleProps) {
  return (
    <DisclosurePrimitives.Disclosure
      data-collapsible=""
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface CollapsibleTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function CollapsibleTrigger({ className, ...props }: CollapsibleTriggerProps) {
  return (
    <ButtonPrimitives.Button
      slot="trigger"
      data-collapsible-trigger=""
      className={composeRenderProps(className, (c) =>
        trigger({ className: c }),
      )}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface CollapsiblePanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

function CollapsiblePanel({ className, ...props }: CollapsiblePanelProps) {
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-collapsible-panel=""
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

export type {
  CollapsiblePanelProps,
  CollapsibleProps,
  CollapsibleTriggerProps,
};
export { Collapsible, CollapsiblePanel, CollapsibleTrigger };
