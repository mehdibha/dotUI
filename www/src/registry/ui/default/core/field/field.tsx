"use client";

import { AsteriskIcon } from "lucide-react";
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
    root: "flex flex-col items-start gap-2",
    label:
      "peer-disabled:text-fg-disabled inline-flex items-center gap-px text-sm font-medium leading-none peer-disabled:cursor-not-allowed [&_svg]:size-3",
    description: "text-fg-muted text-xs",
    fieldError: "text-fg-danger text-xs",
  },
});

type LabelProps = AriaLabelProps & {
  isRequired?: boolean;
  necessityIndicator?: "label" | "icon";
};
const Label = ({
  className,
  children,
  isRequired,
  necessityIndicator,
  ...props
}: LabelProps) => {
  const { label } = fieldStyles();
  const necessityLabel = isRequired ? "(required)" : "(optional)";
  return (
    <AriaLabel className={label({ className })} {...props}>
      {children}
      {isRequired && (
        <span aria-hidden>{necessityIndicator === "icon" ? <></> : <></>}</span>
      )}
      {(necessityIndicator === "label" ||
        (necessityIndicator === "icon" && isRequired)) &&
        " \u200b"}
      {necessityIndicator === "label" && (
        <span aria-hidden>{necessityLabel}</span>
      )}
      {necessityIndicator === "icon" && isRequired && <AsteriskIcon />}
    </AriaLabel>
  );
};

type DescriptionProps = AriaTextProps;
const Description = ({ className, ...props }: DescriptionProps) => {
  const { description } = fieldStyles();
  return (
    <AriaText
      {...props}
      slot="description"
      className={description({ className })}
    />
  );
};

type FieldErrorProps = Omit<AriaFieldErrorProps, "className"> & {
  className?: string;
};
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
    validation?.isInvalid &&
    (!!errorMessage || validation.validationErrors.length > 0);
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
  isRequired?: LabelProps["isRequired"];
  necessityIndicator?: LabelProps["necessityIndicator"];
  contextualHelp?: React.ReactNode;
  children?: React.ReactNode;
}
const Field = (props: FieldProps) => {
  const {
    children,
    label,
    isRequired,
    necessityIndicator,
    contextualHelp,
    ...helpTextProps
  } = props;
  return (
    <>
      {label && contextualHelp && (
        <span className="flex items-center gap-2">
          <Label
            isRequired={isRequired}
            necessityIndicator={necessityIndicator}
          >
            {label}
          </Label>
          {contextualHelp}
        </span>
      )}
      {label && !contextualHelp && (
        <Label isRequired={isRequired} necessityIndicator={necessityIndicator}>
          {label}
        </Label>
      )}
      {children}
      <HelpText {...helpTextProps} />
    </>
  );
};
Field.displayName = "Field";

export type {
  LabelProps,
  DescriptionProps,
  FieldErrorProps,
  HelpTextProps,
  FieldProps,
};
export { Label, Description, FieldError, HelpText, Field, fieldStyles };
