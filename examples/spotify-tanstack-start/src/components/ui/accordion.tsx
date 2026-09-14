"use client";

import * as ButtonPrimitives from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DisclosurePrimitives from "react-aria-components/Disclosure";
import * as DisclosureGroupPrimitives from "react-aria-components/DisclosureGroup";
import * as HeadingPrimitives from "react-aria-components/Heading";
import { ChevronDownIcon } from "lucide-react";
import { tv } from "tailwind-variants";

const accordionVariants = tv({
  slots: {
    root: "flex w-full flex-col",
    item: "group/accordion-item w-full disabled:text-(--disabled-fg,currentColor) disabled:**:[svg]:text-(--disabled-fg,currentColor) not-last:border-b",
    heading: "flex",
    trigger:
      "focus-reset focus-visible:focus-ring flex flex-1 cursor-interactive items-start gap-4 rounded-md py-3 text-left text-sm font-medium transition-shadow disabled:pointer-events-none justify-between",
    marker:
      "pointer-events-none shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-200 **:[svg]:size-4 group-expanded/accordion-item:rotate-180",
    panel:
      "h-(--disclosure-panel-height) overflow-clip text-sm text-fg-muted opacity-0 duration-300 ease-fluid-out group-expanded/accordion-item:opacity-100 motion-safe:transition-[height,opacity]",
    panelContent: "pb-3",
  },
});

const { root, item, heading, trigger, marker, panel, panelContent } =
  accordionVariants();

/* -------------------------------------------------------------------------- */

interface AccordionProps extends React.ComponentProps<
  typeof DisclosureGroupPrimitives.DisclosureGroup
> {}

function Accordion({ className, ...props }: AccordionProps) {
  return (
    <DisclosureGroupPrimitives.DisclosureGroup
      data-accordion=""
      className={composeRenderProps(className, (c) => root({ className: c }))}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface AccordionItemProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

function AccordionItem({ className, ...props }: AccordionItemProps) {
  return (
    <DisclosurePrimitives.Disclosure
      data-accordion-item=""
      className={composeRenderProps(className, (c) => item({ className: c }))}
      {...props}
    />
  );
}

/* -------------------------------------------------------------------------- */

interface AccordionTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

function AccordionTrigger({ className, ...props }: AccordionTriggerProps) {
  const glyph = <ChevronDownIcon />;
  return (
    <HeadingPrimitives.Heading className={heading()}>
      <ButtonPrimitives.Button
        slot="trigger"
        data-accordion-trigger=""
        className={composeRenderProps(className, (c) =>
          trigger({ className: c }),
        )}
        {...props}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {children}
            <span data-accordion-marker="" className={marker()}>
              {glyph}
            </span>
          </>
        ))}
      </ButtonPrimitives.Button>
    </HeadingPrimitives.Heading>
  );
}

/* -------------------------------------------------------------------------- */

interface AccordionPanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

function AccordionPanel({ className, ...props }: AccordionPanelProps) {
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-accordion-panel=""
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    >
      <div className={panelContent()}>{props.children}</div>
    </DisclosurePrimitives.DisclosurePanel>
  );
}

/* -------------------------------------------------------------------------- */

export type {
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
  AccordionTriggerProps,
};
export { Accordion, AccordionItem, AccordionPanel, AccordionTrigger };
