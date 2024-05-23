"use client";

import * as React from "react";
import {
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  type TextProps as AriaTextProps,
  type LabelProps as AriaLabelProps,
  type FieldErrorProps as AriaFieldErrorProps,
  FieldErrorContext,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const labelStyles = tv({
  base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled",
});
type LabelProps = AriaLabelProps & VariantProps<typeof labelStyles>;
const Label = React.forwardRef<React.ElementRef<typeof AriaLabel>, LabelProps>(
  ({ className, ...props }, ref) => (
    <AriaLabel ref={ref} className={labelStyles({ className })} {...props} />
  )
);
Label.displayName = "Label";

const descriptionStyles = tv({
  base: "text-xs text-fg-muted",
});
type DescriptionProps = AriaTextProps & VariantProps<typeof descriptionStyles>;
const Description = React.forwardRef<React.ElementRef<typeof AriaText>, DescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <AriaText
        {...props}
        ref={ref}
        slot="description"
        className={descriptionStyles({ className })}
      />
    );
  }
);
Description.displayName = "Description";

const fiellErrorStyles = tv({
  base: "text-xs text-fg-danger",
});
type FieldErrorProps = Omit<AriaFieldErrorProps, "className"> &
  VariantProps<typeof fiellErrorStyles> & { className?: string };
const FieldError = React.forwardRef<
  React.ElementRef<typeof AriaFieldError>,
  FieldErrorProps
>(({ className, ...props }, ref) => {
  return (
    <AriaFieldError {...props} ref={ref} className={fiellErrorStyles({ className })} />
  );
});
FieldError.displayName = "FieldError";

interface HelpTextProps {
  errorMessage?: FieldErrorProps["children"];
  fieldErrorProps?: Omit<FieldErrorProps, "children">;
  description?: DescriptionProps["children"];
  descriptionProps?: Omit<DescriptionProps, "children">;
}
const HelpText = React.forwardRef<HTMLElement, HelpTextProps>((props, ref) => {
  const { errorMessage, fieldErrorProps, description, descriptionProps } = props;
  const validation = React.useContext(FieldErrorContext);
  const isErrorMessage =
    validation.isInvalid && (!!errorMessage || validation.validationErrors.length > 0);
  const hasHelpText = !!description || isErrorMessage;

  if (!hasHelpText) return null;

  return isErrorMessage ? (
    <FieldError ref={ref} {...validation} {...fieldErrorProps}>
      {errorMessage}
    </FieldError>
  ) : (
    <Description ref={ref} {...descriptionProps}>
      {description}
    </Description>
  );
});
HelpText.displayName = "HelpText";

interface FieldProps extends HelpTextProps {
  label?: LabelProps["children"];
  labelProps?: Omit<LabelProps, "children">;
  children?: React.ReactNode;
}
const Field = (props: FieldProps) => {
  const { children, label, labelProps, ...helpTextProps } = props;
  return (
    <>
      {label && <Label {...labelProps}>{label}</Label>}
      {children}
      <HelpText {...helpTextProps} />
    </>
  );
};
Field.displayName = "Field";

export type { LabelProps, DescriptionProps, FieldErrorProps, HelpTextProps, FieldProps };
export { Label, Description, FieldError, HelpText, Field };
