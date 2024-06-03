"use client";

import * as React from "react";
import {
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  FieldErrorContext as AriaFieldErrorContext,
  type TextProps as AriaTextProps,
  type LabelProps as AriaLabelProps,
  type FieldErrorProps as AriaFieldErrorProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const fieldStyles = tv({
  slots: {
    root: "",
    label:
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled",
    description: "text-xs text-fg-muted",
    fieldError: "text-xs text-fg-danger",
  },
});

type LabelProps = AriaLabelProps;
const Label = ({ className, ...props }: LabelProps) => {
  const { label } = fieldStyles();
  return <AriaLabel className={label({ className })} {...props} />;
};

type DescriptionProps = AriaTextProps;
const Description = ({ className, ...props }: DescriptionProps) => {
  const { description } = fieldStyles();
  return (
    <AriaText {...props} slot="description" className={description({ className })} />
  );
};

type FieldErrorProps = Omit<AriaFieldErrorProps, "className"> & { className?: string };
const FieldError = ({ className, ...props }: FieldErrorProps) => {
  const { fieldError } = fieldStyles();
  return <AriaFieldError {...props} className={fieldError({ className })} />;
};

interface HelpTextProps {
  errorMessage?: FieldErrorProps["children"];
  description?: DescriptionProps["children"];
}
const HelpText = (props: HelpTextProps) => {
  const { errorMessage, description } = props;
  const validation = React.useContext(AriaFieldErrorContext);
  const isErrorMessage =
    validation.isInvalid && (!!errorMessage || validation.validationErrors.length > 0);
  const hasHelpText = !!description || isErrorMessage;

  if (!hasHelpText) return null;

  return isErrorMessage ? (
    <FieldError>{errorMessage}</FieldError>
  ) : (
    <Description>{description}</Description>
  );
};

interface FieldProps extends HelpTextProps {
  label?: LabelProps["children"];
  children?: React.ReactNode;
}
const Field = (props: FieldProps) => {
  const { children, label, ...helpTextProps } = props;
  return (
    <>
      {label && <Label>{label}</Label>}
      {children}
      <HelpText {...helpTextProps} />
    </>
  );
};
Field.displayName = "Field";

export type { LabelProps, DescriptionProps, FieldErrorProps, HelpTextProps, FieldProps };
export { Label, Description, FieldError, HelpText, Field, fieldStyles };
