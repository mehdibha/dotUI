import type { Checkbox as AriaCheckbox } from "react-aria-components";

export interface CheckboxProps
  extends React.ComponentProps<typeof AriaCheckbox> {}

export interface CheckboxIndicatorProps extends React.ComponentProps<"div"> {}
