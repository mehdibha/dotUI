import type {
  FieldError as AriaFieldError,
  Label as AriaLabel,
} from "react-aria-components";

import type { Text } from "@dotui/registry/ui/text";

export interface FieldsetProps extends React.ComponentProps<"fieldset"> {}

export interface LegendProps extends React.ComponentProps<"legend"> {}

export interface FieldGroupProps extends React.ComponentProps<"div"> {}

export interface FieldProps extends React.ComponentProps<"div"> {
  /**
   * The orientation of the field layout.
   * @default 'vertical'
   */
  orientation?: "horizontal" | "vertical";
}

export interface FieldContentProps extends React.ComponentProps<"div"> {}

export interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}

export interface DescriptionProps
  extends Omit<React.ComponentProps<typeof Text>, "slot"> {}

export interface FieldErrorProps
  extends React.ComponentProps<typeof AriaFieldError> {}
