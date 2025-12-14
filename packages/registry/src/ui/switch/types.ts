import type { Switch as AriaSwitch } from "react-aria-components";

/**
 * A switch allows a user to turn a setting on or off.
 */
export interface SwitchProps extends React.ComponentProps<typeof AriaSwitch> {
  /**
   * The visual style of the switch.
   * @default 'default'
   */
  variant?: "default";

  /**
   * The size of the switch.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

/**
 * Missing description.
 */
export interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}

/**
 * Missing description.
 */
export interface SwitchThumbProps extends React.ComponentProps<"span"> {}
