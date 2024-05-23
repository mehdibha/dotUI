"use client";

import * as React from "react";
import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Field, type FieldProps } from "../field";

const radioGroupStyles = tv({
  slots: {
    root: "",
  },
});

interface RadioGroupProps
  extends Omit<AriaRadioGroupProps, "children" | "className">,
    VariantProps<typeof radioGroupStyles>,
    FieldProps {
  className?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof AriaRadioGroup>,
  RadioGroupProps
>(
  (
    {
      className,
      children,
      label,
      labelProps,
      description,
      descriptionProps,
      errorMessage,
      fieldErrorProps,
      ...props
    },
    ref
  ) => {
    const { root } = radioGroupStyles({});
    return (
      <AriaRadioGroup ref={ref} className={root({ className })} {...props}>
        {({}) => (
          <Field
            label={label}
            labelProps={labelProps}
            description={description}
            descriptionProps={descriptionProps}
            errorMessage={errorMessage}
            fieldErrorProps={fieldErrorProps}
          >
            <div className="space-y-2">{children}</div>
          </Field>
        )}
      </AriaRadioGroup>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
