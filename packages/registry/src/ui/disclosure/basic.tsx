"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const disclosureStyles = tv({
  slots: {
    root: "group/disclosure w-full",
    heading: "flex",
    button: [
      "focus-reset focus-visible:focus-ring",
      "flex w-full flex-1 items-center justify-between gap-4 rounded-md py-3 text-left font-medium text-sm outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-expanded]>svg]:rotate-180",
    ],
    panel:
      "h-(--disclosure-panel-height) overflow-clip text-fg-muted text-sm duration-200 ease-out motion-safe:transition-[height]",
  },
});

const { root, panel, heading, button } = disclosureStyles();

/* ---------------------------------------------------------------------------------*/

interface DisclosureProps extends React.ComponentProps<typeof AriaDisclosure> {}

function Disclosure({ className, ...props }: DisclosureProps) {
  return (
    <AriaDisclosure
      data-slot="disclosure"
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------------------------*/

interface DisclosurePanelProps
  extends React.ComponentProps<typeof AriaDisclosurePanel> {}

function DisclosurePanel({ className, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      data-slot="disclosure-panel"
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------------------------*/

interface DisclosureHeadingProps
  extends React.ComponentProps<typeof AriaHeading> {}

function DisclosureHeading({
  children,
  className,
  ...props
}: DisclosureHeadingProps) {
  return (
    <AriaHeading
      data-slot="disclosure-heading"
      className={heading({ className })}
      {...props}
    >
      <AriaButton slot="trigger" className={button()}>
        {children}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 text-fg-muted transition-transform duration-200" />
      </AriaButton>
    </AriaHeading>
  );
}

/* ---------------------------------------------------------------------------------*/

export { Disclosure, DisclosurePanel, DisclosureHeading };

export type { DisclosureProps, DisclosurePanelProps, DisclosureHeadingProps };
