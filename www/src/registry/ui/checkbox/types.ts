import type { Checkbox as AriaCheckbox } from "react-aria-components";

/**
 * A checkbox allows a user to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 */
export interface CheckboxProps extends React.ComponentProps<typeof AriaCheckbox> {}

/**
 * Missing description.
 */
export interface CheckboxIndicatorProps extends React.ComponentProps<"div"> {}
