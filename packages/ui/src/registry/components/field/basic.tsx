"use client";

import React from "react";
import {
  FieldError as AriaFieldError,
  Label as AriaLabel,
  Text as AriaText,
  composeRenderProps,
  FieldErrorContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const labelStyles = tv({
  base: "inline-flex text-sm items-center gap-px leading-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3 text-fg-muted",
});

interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}
const Label = ({ className, ...props }: LabelProps) => {
  return (
    <AriaLabel
      data-slot="label"
      className={labelStyles({ className })}
      {...props}
    />
  );
};

const descriptionStyles = tv({
  base: "text-xs text-fg-muted",
});

interface DescriptionProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}
const Description = ({ className, ...props }: DescriptionProps) => {
  return (
    <AriaText
      slot="description"
      className={descriptionStyles({ className })}
      {...props}
    />
  );
};

const fieldErrorStyles = tv({
  base: "text-xs text-fg-danger",
});

interface FieldErrorProps extends React.ComponentProps<typeof AriaFieldError> {}
const FieldError = ({ className, ...props }: FieldErrorProps) => {
  return (
    <AriaFieldError
      className={composeRenderProps(className, (className) =>
        fieldErrorStyles({ className }),
      )}
      {...props}
    />
  );
};

interface HelpTextProps {
  description?: DescriptionProps["children"];
  errorMessage?: FieldErrorProps["children"];
}
const HelpText = ({ description, errorMessage }: HelpTextProps) => {
  const validation = React.use(FieldErrorContext);
  const isError =
    validation?.isInvalid &&
    (!!errorMessage || validation.validationErrors.length > 0);

  if (isError) return <FieldError>{errorMessage}</FieldError>;

  if (description) return <Description>{description}</Description>;

  return null;
};

interface FieldProps extends HelpTextProps {
  label?: LabelProps["children"];
}

export type {
  LabelProps,
  DescriptionProps,
  FieldErrorProps,
  HelpTextProps,
  FieldProps,
};
export { Label, Description, FieldError, HelpText };
