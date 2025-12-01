import type {
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
} from "react-aria-components";

/**
 * A disclosure is a collapsible section of content. It is composed of a header
 * with a heading and trigger button, and a panel that contains the content.
 */
export interface DisclosureProps
  extends React.ComponentProps<typeof AriaDisclosure> {}

/**
 * A DisclosurePanel provides the content for a disclosure.
 */
export interface DisclosurePanelProps
  extends React.ComponentProps<typeof AriaDisclosurePanel> {}

/**
 * A DisclosureHeading provides the heading and trigger for a disclosure.
 */
export interface DisclosureHeadingProps
  extends React.ComponentProps<typeof AriaHeading> {}
