"use client";

import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const checkboxGroupStyles = tv({
  slots: {
    root: "flex flex-col items-start gap-2",
    wrapper: "flex",
  },
  variants: {
    variant: {
      default: {
        wrapper: "flex-col gap-0.5",
      },
      card: {
        wrapper: "flex gap-2",
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface CheckboxGroupRootProps
  extends React.ComponentProps<typeof AriaCheckboxGroup> {}

