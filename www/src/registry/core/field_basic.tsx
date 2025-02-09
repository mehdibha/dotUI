"use client";

import React from "react";
import {
  Label as AriaLabel,
  Text as AriaText,
  FieldError as AriaFieldError,
  FieldErrorContext,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const labelStyles = tv({
  base: "peer-disabled:text-fg-disabled inline-flex items-center gap-px text-sm font-medium leading-none peer-disabled:cursor-not-allowed [&_svg]:size-3",
});

interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}
const Label = ({ className, ...props }: LabelProps) => {
  return <AriaLabel className={labelStyles({ className })} {...props} />;
};

const descriptionStyles = tv({
  base: "text-fg-muted text-xs",
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
  base: "text-fg-danger text-xs",
});

interface FieldErrorProps extends React.ComponentProps<typeof AriaFieldError> {}
const FieldError = ({ className, ...props }: FieldErrorProps) => {
  return (
    <AriaFieldError
      className={composeRenderProps(className, (className) =>
        fieldErrorStyles({ className })
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
