import type {
  Button as AriaButton,
  Link as AriaLink,
} from "react-aria-components";

export interface ButtonProps extends React.ComponentProps<typeof AriaButton> {
  /**
   * The visual style of the button (Vanilla CSS implementation specific).
   * @default 'default'
   */
  variant?:
    | "default"
    | "primary"
    | "quiet"
    | "link"
    | "success"
    | "warning"
    | "danger";

  /**
   * The size of the button.
   * @default "md"
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

export interface LinkButtonProps extends React.ComponentProps<typeof AriaLink> {
  /**
   * The visual style of the button.
   * @default "default"
   */
  variant?:
    | "default"
    | "primary"
    | "quiet"
    | "link"
    | "success"
    | "warning"
    | "danger";

  /**
   * The size of the button.
   * @default "md"
   */
  size?: "sm" | "md" | "lg";

  /**
   * Controls the button's aspect ratio behavior.
   * - `"auto"`: Automatically detects if the button contains only an icon and applies square aspect.
   * - `"square"`: Forces square aspect ratio (equal width and height).
   * - `"default"`: Standard button sizing with padding.
   * @default "auto"
   */
  aspect?: "default" | "square" | "auto";
}
