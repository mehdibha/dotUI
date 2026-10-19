import type * as CheckboxPrimitives from "react-aria-components/Checkbox"

/**
 * A checkbox allows a user to select multiple items from a list of individual items,
 * or to mark one individual item as selected.
 */
export interface CheckboxProps extends React.ComponentProps<
  typeof CheckboxPrimitives.CheckboxField
> {}

/**
 * The control element of a checkbox.
 */
export interface CheckboxControlProps extends React.ComponentProps<
  typeof CheckboxPrimitives.CheckboxButton
> {}

/**
 * The visual indicator of a checkbox (the box with check/minus icon).
 */
export interface CheckboxIndicatorProps extends React.ComponentProps<"span"> {}
