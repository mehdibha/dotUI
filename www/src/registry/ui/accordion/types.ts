import type * as ButtonPrimitives from 'react-aria-components/Button'
import type * as DisclosurePrimitives from 'react-aria-components/Disclosure'
import type * as DisclosureGroupPrimitives from 'react-aria-components/DisclosureGroup'

/**
 * An accordion is a grouping of related collapsible items.
 * It supports both single and multiple expanded items.
 */
export interface AccordionProps extends React.ComponentProps<
  typeof DisclosureGroupPrimitives.DisclosureGroup
> {}

/**
 * An AccordionItem is a collapsible section within an accordion. It is
 * composed of a trigger and a panel that contains the content.
 */
export interface AccordionItemProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

/**
 * An AccordionTrigger provides the trigger for an accordion item.
 */
export interface AccordionTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

/**
 * An AccordionPanel provides the content for an accordion item.
 */
export interface AccordionPanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}
