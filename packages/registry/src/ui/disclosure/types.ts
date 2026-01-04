import type {
	Button as AriaButton,
	Disclosure as AriaDisclosure,
	DisclosurePanel as AriaDisclosurePanel,
} from "react-aria-components";

/**
 * A disclosure is a collapsible section of content. It is composed of a header
 * with a heading and trigger button, and a panel that contains the content.
 */
export interface DisclosureProps extends React.ComponentProps<typeof AriaDisclosure> {}

/**
 * A DisclosurePanel provides the content for a disclosure.
 */
export interface DisclosurePanelProps extends React.ComponentProps<typeof AriaDisclosurePanel> {}

/**
 * A DisclosureTrigger provides the trigger for a disclosure.
 */
export interface DisclosureTriggerProps extends React.ComponentProps<typeof AriaButton> {}
