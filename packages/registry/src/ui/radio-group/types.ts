import type {
  Radio as AriaRadio,
  RadioGroupProps as AriaRadioGroupProps,
} from "react-aria-components";

export interface RadioGroupProps extends AriaRadioGroupProps {}

export interface RadioProps extends React.ComponentProps<typeof AriaRadio> {}

export interface RadioIndicatorProps extends React.ComponentProps<"div"> {}
