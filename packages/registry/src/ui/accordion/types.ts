import type {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
} from "react-aria-components";

/**
 * A DisclosureGroup is a grouping of related disclosures, sometimes called an accordion.
 * It supports both single and multiple expanded items.
 */
export interface AccordionProps
  extends React.ComponentProps<typeof AriaDisclosureGroup> {}

/**
 * A disclosure is a collapsible section of content. It is composed of a header
 * with a heading and trigger button, and a panel that contains the content.
 */
export interface AccordionItemProps
  extends React.ComponentProps<typeof AriaDisclosure> {}

/**
 * A DisclosurePanel provides the content for a disclosure.
 */
export interface AccordionPanelProps
  extends React.ComponentProps<typeof AriaDisclosurePanel> {}

/**
 * Missing description.
 */
export interface AccordionHeadingProps
  extends React.ComponentProps<typeof AriaHeading> {}
