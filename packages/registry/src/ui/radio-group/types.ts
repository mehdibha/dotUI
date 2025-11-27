import type {
  Radio as AriaRadio,
  RadioGroupProps as AriaRadioGroupProps,
} from "react-aria-components";

/**
 * A radio group allows a user to select a single item from a list of mutually exclusive options.
 */
export interface RadioGroupProps extends AriaRadioGroupProps {}

/**
 * A radio represents an individual option within a radio group.
 */
export interface RadioProps extends React.ComponentProps<typeof AriaRadio> {}

/**
 * Missing description.
 */
export interface RadioIndicatorProps extends React.ComponentProps<"div"> {}
