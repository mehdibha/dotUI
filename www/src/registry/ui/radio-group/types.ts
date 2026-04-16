import * as RadioGroupPrimitives from "react-aria-components/RadioGroup";

/**
 * A radio group allows a user to select a single item from a list of mutually exclusive options.
 */
export interface RadioGroupProps extends RadioGroupPrimitives.RadioGroupProps {}

/**
 * A radio represents an individual option within a radio group.
 */
export interface RadioProps extends React.ComponentProps<typeof RadioGroupPrimitives.Radio> {}

/**
 * Missing description.
 */
export interface RadioIndicatorProps extends React.ComponentProps<"div"> {}
