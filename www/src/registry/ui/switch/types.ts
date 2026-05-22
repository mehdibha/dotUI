import type * as SwitchPrimitive from "react-aria-components/Switch";

/**
 * A switch allows a user to turn a setting on or off.
 */
export interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.SwitchField> {
	/**
	 * The size of the switch.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * The control element of a switch.
 */
export interface SwitchControlProps extends React.ComponentProps<typeof SwitchPrimitive.SwitchButton> {
	/**
	 * The size of the switch control.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * The visual track of a switch.
 */
export interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}

/**
 * The visual thumb of a switch.
 */
export interface SwitchThumbProps extends React.ComponentProps<"span"> {}
