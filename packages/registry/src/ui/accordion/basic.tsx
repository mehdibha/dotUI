"use client";

import { use } from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosureGroupStateContext as AriaDisclosureGroupStateContext,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const disclosureVariants = tv({
  slots: {
    group: "space-y-2",
    item: "data-in-group:not-first:border-t",
    heading: "flex",
    button: [
      "focus-reset focus-visible:focus-ring",
      "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left font-medium text-sm outline-none transition-all hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
    ],
    panel:
      "h-(--disclosure-panel-height) overflow-clip duration-200 ease-out motion-safe:transition-[height]",
  },
});

const { group, item, panel, heading, button } = disclosureVariants();

interface AccordionProps
  extends React.ComponentProps<typeof AriaDisclosureGroup> {}
function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AriaDisclosureGroup
      data-slot="disclosure-group"
      className={composeRenderProps(className, (c) => group({ className: c }))}
      {...props}
    />
  );
}

interface AccordionItemProps
  extends React.ComponentProps<typeof AriaDisclosure> {}
function AccordionItem({ className, ...props }: AccordionItemProps) {
  const isInGroup = use(AriaDisclosureGroupStateContext) !== null;
  return (
    <AriaDisclosure
      data-slot="disclosure-item"
      data-in-group={isInGroup || undefined}
      className={composeRenderProps(className, (c) => item({ className: c }))}
      {...props}
    />
  );
}

interface AccordionPanelProps
  extends React.ComponentProps<typeof AriaDisclosurePanel> {}
function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  return (
    <AriaDisclosurePanel
      data-slot="disclosure-panel"
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    />
  );
}

interface AccordionHeadingProps
  extends React.ComponentProps<typeof AriaHeading> {}
function AccordionHeading({
  children,
  className,
  ...props
}: AccordionHeadingProps) {
  return (
    <AriaHeading
      data-slot="disclosure-heading"
      className={heading({ className })}
      {...props}
    >
      <AriaButton slot="trigger" className={button()}>
        {children}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-200" />
      </AriaButton>
    </AriaHeading>
  );
}

export { Accordion, AccordionItem, AccordionPanel, AccordionHeading };

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionPanelProps,
  AccordionHeadingProps,
};
