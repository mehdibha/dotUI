import * as ButtonPrimitives from "react-aria-components/Button";
import * as DisclosurePrimitives from "react-aria-components/Disclosure";

/**
 * A disclosure is a collapsible section of content. It is composed of a header
 * with a heading and trigger button, and a panel that contains the content.
 */
export interface DisclosureProps extends React.ComponentProps<typeof DisclosurePrimitives.Disclosure> {}

/**
 * A DisclosurePanel provides the content for a disclosure.
 */
export interface DisclosurePanelProps extends React.ComponentProps<typeof DisclosurePrimitives.DisclosurePanel> {}

/**
 * A DisclosureTrigger provides the trigger for a disclosure.
 */
export interface DisclosureTriggerProps extends React.ComponentProps<typeof ButtonPrimitives.Button> {}
