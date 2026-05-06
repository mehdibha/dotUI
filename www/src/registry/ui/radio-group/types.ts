import type * as RadioGroupPrimitives from "react-aria-components/RadioGroup";

/**
 * A radio group allows a user to select a single item from a list of mutually exclusive options.
 */
export interface RadioGroupProps extends RadioGroupPrimitives.RadioGroupProps {}

/**
 * A radio represents an individual option within a radio group.
 */
export interface RadioProps extends React.ComponentProps<typeof RadioGroupPrimitives.RadioField> {}

/**
 * The clickable radio control, including the indicator and optional label content.
 */
export interface RadioControlProps extends React.ComponentProps<typeof RadioGroupPrimitives.RadioButton> {}

/**
 * The visual selected state indicator for a radio control.
 */
export interface RadioIndicatorProps extends React.ComponentProps<"span"> {}
