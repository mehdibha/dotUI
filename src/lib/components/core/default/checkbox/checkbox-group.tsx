"use client";

import * as React from "react";
import {
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Field, type FieldProps } from "../field";

const checkboxGroupStyles = tv({
  slots: {
    root: "space-y-2",
  },
});

interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, "children" | "className">,
    VariantProps<typeof checkboxGroupStyles>,
    FieldProps {
  className?: string;
}

const CheckboxGroup = React.forwardRef<
  React.ElementRef<typeof AriaCheckboxGroup>,
  CheckboxGroupProps
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
    const { root } = checkboxGroupStyles({});
    return (
      <AriaCheckboxGroup ref={ref} className={root({ className })} {...props}>
        {({}) => (
          <Field
            label={label}
            labelProps={labelProps}
            description={description}
            descriptionProps={descriptionProps}
            errorMessage={errorMessage}
            fieldErrorProps={fieldErrorProps}
          >
            <div className="space-y-0.5">{children}</div>
          </Field>
        )}
      </AriaCheckboxGroup>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

export { CheckboxGroup };
