import type { ToggleButton as AriaToggleButton } from "react-aria-components";

/**
 * A toggle button allows a user to toggle a selection on or off, for example switching between two states or modes.
 */
export interface ToggleButtonProps
  extends React.ComponentProps<typeof AriaToggleButton> {
  /**
   * The visual style of the toggle button.
   * @default 'default'
   */
  variant?: "default" | "quiet";

  /**
   * The size of the toggle button.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Controls the button's aspect ratio behavior.
   * - `"auto"`: Automatically detects if the button contains only an icon and applies square aspect.
   * - `"square"`: Forces square aspect ratio.
   * - `"default"`: Standard button sizing with padding.
   * @default "auto"
   */
  aspect?: "default" | "square" | "auto";
}
