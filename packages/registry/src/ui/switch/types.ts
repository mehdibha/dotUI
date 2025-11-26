import type { Switch as AriaSwitch } from "react-aria-components";

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

export interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}

export interface SwitchThumbProps extends React.ComponentProps<"span"> {}

