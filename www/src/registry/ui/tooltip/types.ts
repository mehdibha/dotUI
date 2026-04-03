import type { Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";

/**
 * TooltipTrigger wraps around a trigger element and a Tooltip. It handles opening and closing
 * the Tooltip when the user hovers over or focuses the trigger, and positioning the Tooltip relative to the trigger.
 */
export interface TooltipProps extends React.ComponentProps<typeof AriaTooltipTrigger> {}

/**
 * A tooltip displays a description of an element on hover or focus.
 */
export interface TooltipContentProps extends React.ComponentProps<typeof AriaTooltip> {
	/**
	 * Whether to hide the tooltip arrow.
	 * @default false
	 */
	hideArrow?: boolean;
}
