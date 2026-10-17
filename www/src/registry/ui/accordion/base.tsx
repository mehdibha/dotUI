"use client"

import type * as React from "react"
import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as DisclosurePrimitives from "react-aria-components/Disclosure"
import * as DisclosureGroupPrimitives from "react-aria-components/DisclosureGroup"
import * as HeadingPrimitives from "react-aria-components/Heading"

import { createParamValue } from "@/lib/styles"
import { ChevronDownIcon, ChevronRightIcon } from "@/registry/icons"

import { useStyles } from "./styles"

// MARK: accordionStyles

const useMarker = createParamValue({
  componentName: "accordion",
  paramName: "marker",
  defaultValue: "trailing-chevron",
  values: {
    "trailing-chevron": <ChevronDownIcon />,
    "leading-caret": <ChevronRightIcon />,
  },
})

// MARK: Separator

interface AccordionProps extends React.ComponentProps<
  typeof DisclosureGroupPrimitives.DisclosureGroup
> {}

const Accordion = ({ className, ...props }: AccordionProps) => {
  const { root } = useStyles()()
  return (
    <DisclosureGroupPrimitives.DisclosureGroup
      data-accordion=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface AccordionItemProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

const AccordionItem = ({ className, ...props }: AccordionItemProps) => {
  const { item } = useStyles()()
  return (
    <DisclosurePrimitives.Disclosure
      data-accordion-item=""
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface AccordionTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

const AccordionTrigger = ({ className, ...props }: AccordionTriggerProps) => {
  const { heading, trigger, marker } = useStyles()()
  const glyph = useMarker()
  return (
    <HeadingPrimitives.Heading className={heading()}>
      <ButtonPrimitives.Button
        slot="trigger"
        data-accordion-trigger=""
        className={composeRenderProps(className, (className) =>
          trigger({ className }),
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
  )
}

// MARK: Separator

interface AccordionPanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}

const AccordionPanel = ({ className, ...props }: AccordionPanelProps) => {
  const { panel, panelContent } = useStyles()()
  return (
    <DisclosurePrimitives.DisclosurePanel
      data-accordion-panel=""
      className={composeRenderProps(className, (className) =>
        panel({ className }),
      )}
      {...props}
    >
      <div className={panelContent()}>{props.children}</div>
    </DisclosurePrimitives.DisclosurePanel>
  )
}

// MARK: Separator

export type {
  AccordionItemProps,
  AccordionPanelProps,
  AccordionProps,
  AccordionTriggerProps,
}
export { Accordion, AccordionItem, AccordionPanel, AccordionTrigger }
