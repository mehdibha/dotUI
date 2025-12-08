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
    root: "group/disclosure w-full disabled:text-fg-disabled **:data-button:[&[slot=trigger]]:w-full **:data-button:[&[slot=trigger]]:justify-between **:data-button:[&[slot=trigger]]:text-left disabled:**:[svg]:text-fg-disabled",
    heading: "flex",
    button: [
      "focus-reset focus-visible:focus-ring",
      "flex flex-1 cursor-interactive items-start justify-between gap-4 rounded-md py-2 text-left font-medium text-sm transition-shadow disabled:pointer-events-none",
    ],
    panel:
      "h-(--disclosure-panel-height) overflow-clip text-fg-muted text-sm opacity-0 duration-300 ease-fluid-out group-expanded/disclosure:opacity-100 motion-safe:transition-[height,opacity]",
  },
});

const { root, panel, heading, button } = disclosureStyles();

/* ---------------------------------------------------------------------------------*/

interface DisclosureProps extends React.ComponentProps<typeof AriaDisclosure> {}

function Disclosure({ className, ...props }: DisclosureProps) {
  return (
    <AriaDisclosure
      data-disclosure=""
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
      data-disclosure-panel=""
      className={composeRenderProps(className, (c) => panel({ className: c }))}
      {...props}
    />
  );
}

/* ---------------------------------------------------------------------------------*/

interface DisclosureTriggerProps
  extends React.ComponentProps<typeof AriaButton> {}

function DisclosureTrigger(props: DisclosureTriggerProps) {
  return (
    <AriaHeading className={heading()}>
      <AriaButton
        slot="trigger"
        data-disclosure-trigger=""
        className={button()}
        {...props}
      >
        {composeRenderProps(props.children, (children) => (
          <>
            {children}
            <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-200" />
          </>
        ))}
      </AriaButton>
    </AriaHeading>
  );
}

/* ---------------------------------------------------------------------------------*/

export { Disclosure, DisclosurePanel, DisclosureTrigger };

export type { DisclosureProps, DisclosurePanelProps, DisclosureTriggerProps };
