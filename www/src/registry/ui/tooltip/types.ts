import * as TooltipPrimitives from "react-aria-components/Tooltip";

/**
 * TooltipTrigger wraps around a trigger element and a Tooltip. It handles opening and closing
 * the Tooltip when the user hovers over or focuses the trigger, and positioning the Tooltip relative to the trigger.
 */
export interface TooltipProps extends React.ComponentProps<typeof TooltipPrimitives.TooltipTrigger> {}

/**
 * A tooltip displays a description of an element on hover or focus.
 */
export interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitives.Tooltip> {
	/**
	 * Whether to hide the tooltip arrow.
	 * @default false
	 */
	hideArrow?: boolean;
}
