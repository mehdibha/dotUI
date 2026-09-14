import type * as ButtonPrimitives from "react-aria-components/Button"
import type * as DisclosurePrimitives from "react-aria-components/Disclosure"

/**
 * A collapsible shows and hides a section of content from a trigger. It
 * carries no look of its own: put any button in the trigger.
 */
export interface CollapsibleProps extends React.ComponentProps<
  typeof DisclosurePrimitives.Disclosure
> {}

/**
 * A CollapsibleTrigger toggles the panel. Any `Button` with `slot="trigger"`
 * works in its place.
 */
export interface CollapsibleTriggerProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

/**
 * A CollapsiblePanel holds the content that shows and hides.
 */
export interface CollapsiblePanelProps extends React.ComponentProps<
  typeof DisclosurePrimitives.DisclosurePanel
> {}
