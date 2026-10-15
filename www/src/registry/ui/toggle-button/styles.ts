import { createStyles } from "@/lib/styles"

import {
  BUTTON_CASE,
  BUTTON_DENSITY,
  BUTTON_LINK_COLOR,
  BUTTON_LINK_UNDERLINE,
  BUTTON_PRESS,
  BUTTON_SECONDARY,
  BUTTON_STYLES,
  BUTTON_VARIANTS,
  SELECTED_LOOKS,
} from "../button/styles"
import toggleButtonMeta from "./meta"

/* Button's recipe tables, imported: the toggle adds only its selected look. */

const { useStyles, styles } = createStyles(toggleButtonMeta, {
  base: {
    base: [
      "group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--studio-btn-radius) bg-clip-padding font-(--studio-font-weight-label) whitespace-nowrap transition-[background-color,border-color,color,box-shadow,filter,scale,translate] duration-(--studio-button-state-duration) ease-(--studio-button-state-ease) select-ui",
      "focus-reset focus-visible:focus-ring",
      "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      "disabled:cursor-disabled disabled:selected:bg-(--disabled-selected-bg,var(--color-selected)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selected))",
    ],
    variants: {
      variant: BUTTON_VARIANTS,
      size: {
        xs: "rounded-(--studio-btn-xs-radius)",
        sm: "",
        md: "",
        lg: "",
      },
      isIconOnly: {
        true: "p-0",
      },
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
    linkUnderline: BUTTON_LINK_UNDERLINE,
    linkColor: BUTTON_LINK_COLOR,
  },
})

export type ToggleButtonStyles = typeof styles

export { styles as toggleButtonStyles, useStyles }
