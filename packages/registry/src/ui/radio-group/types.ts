import type {
  RadioGroupProps as AriaRadioGroupProps,
  Radio as AriaRadio,
} from "react-aria-components";

export interface RadioGroupProps extends AriaRadioGroupProps {}

export interface RadioProps extends React.ComponentProps<typeof AriaRadio> {}

export interface RadioIndicatorProps extends React.ComponentProps<"div"> {}

