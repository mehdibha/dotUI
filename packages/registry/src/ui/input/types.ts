import type {
  Group as AriaGroup,
  Input as AriaInput,
  TextArea as AriaTextArea,
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  DateInputProps as AriaDateInputProps,
} from "react-aria-components";

export interface InputGroupProps extends React.ComponentProps<typeof AriaGroup> {
  /**
   * The size of the input group.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

export interface InputProps
  extends Omit<React.ComponentProps<typeof AriaInput>, "size"> {
  /**
   * The size of the input.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

export interface TextAreaProps
  extends Omit<React.ComponentProps<typeof AriaTextArea>, "size"> {
  /**
   * The size of the textarea.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";
}

export interface InputAddonProps extends React.ComponentProps<"div"> {}

export interface DateInputProps
  extends Omit<AriaDateInputProps, "children"> {
  /**
   * The size of the date input.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  children?: AriaDateInputProps["children"];
}

export interface DateSegmentProps
  extends React.ComponentProps<typeof AriaDateSegment> {}

