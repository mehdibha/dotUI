import type * as ButtonPrimitives from "react-aria-components/Button"
import type * as DisclosurePrimitives from "react-aria-components/Disclosure"
import type * as DisclosureGroupPrimitives from "react-aria-components/DisclosureGroup"

/**
 * An accordion is a group of collapsible items. It supports both single and
 * multiple expanded items.
 */
export interface AccordionProps extends React.ComponentProps<
  typeof DisclosureGroupPrimitives.DisclosureGroup
> {}

/**
 * An AccordionItem is one collapsible section: a heading trigger and a panel.
 */
export interface AccordionItemProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

/**
 * An AccordionTrigger renders the item's heading, button, and marker.
 */
export interface AccordionTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

/**
 * An AccordionPanel provides the content for an item.
 */
export interface AccordionPanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}
