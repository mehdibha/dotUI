import { createStyles } from "@/lib/styles"

import {
  BUTTON_BASE,
  BUTTON_CASE,
  BUTTON_DENSITY,
  BUTTON_ICON_ONLY,
  BUTTON_PRESS,
  BUTTON_SECONDARY,
  BUTTON_SIZE,
  BUTTON_STYLES,
  PRIMARY_VARIANT,
  QUIET_VARIANT,
  SECONDARY_VARIANT,
  SELECTED_LOOKS,
} from "../button/styles"
import toggleButtonMeta from "./meta"

/* Button's recipe tables, imported: the toggle adds only its selected look. */

const { useStyles, styles } = createStyles(toggleButtonMeta, {
  base: {
    base: [
      BUTTON_BASE,
      "disabled:cursor-disabled disabled:selected:bg-(--disabled-selected-bg,var(--color-selected)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selected))",
    ],
    variants: {
      variant: {
        primary: PRIMARY_VARIANT,
        secondary: SECONDARY_VARIANT,
        quiet: QUIET_VARIANT,
      },
      size: BUTTON_SIZE,
      isIconOnly: BUTTON_ICON_ONLY,
    },
    compoundVariants: [
      {
        variant: "primary",
        class:
          "disabled:selected:bg-(--color-primary-disabled,var(--color-selected))",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
  density: BUTTON_DENSITY,
  params: {
    style: BUTTON_STYLES,
    secondary: BUTTON_SECONDARY,
    press: BUTTON_PRESS,
    case: BUTTON_CASE,
    selected: SELECTED_LOOKS,
  },
})

export type ToggleButtonStyles = typeof styles

export { styles as toggleButtonStyles, useStyles }
