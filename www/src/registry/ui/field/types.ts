import type * as FieldErrorPrimitives from "react-aria-components/FieldError";
import type * as LabelPrimitives from "react-aria-components/Label";

import type { Text } from "@/registry/ui/text";

/**
 * Missing description.
 */
export interface FieldsetProps extends React.ComponentProps<"fieldset"> {}

/**
 * Missing description.
 */
export interface LegendProps extends React.ComponentProps<"legend"> {}

/**
 * Missing description.
 */
export interface FieldGroupProps extends React.ComponentProps<"div"> {}

/**
 * Missing description.
 */
export interface FieldProps extends React.ComponentProps<"div"> {
	/**
	 * The orientation of the field layout.
	 * @default 'vertical'
	 */
	orientation?: "horizontal" | "vertical";
}

/**
 * Missing description.
 */
export interface FieldContentProps extends React.ComponentProps<"div"> {}

/**
 * Missing description.
 */
export interface LabelProps extends React.ComponentProps<typeof LabelPrimitives.Label> {}

/**
 * Missing description.
 */
export interface DescriptionProps extends Omit<React.ComponentProps<typeof Text>, "slot"> {}

/**
 * A FieldError displays validation errors for a form field.
 */
export interface FieldErrorProps extends React.ComponentProps<typeof FieldErrorPrimitives.FieldError> {}
