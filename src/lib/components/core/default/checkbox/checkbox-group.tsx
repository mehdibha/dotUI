"use client";

import * as React from "react";
import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
} from "react-aria-components";
import { Field, fieldStyles, type FieldProps } from "../field";

interface CheckboxGroupProps
  extends CheckboxGroupRootProps,
    Omit<FieldProps, "children"> {}

const CheckboxGroup = React.forwardRef<
  React.ElementRef<typeof AriaCheckboxGroup>,
  CheckboxGroupProps
>(
  (
    { label, description, errorMessage, necessityIndicator, contextualHelp, ...props },
    ref
  ) => {
    return (
      <CheckboxGroupRoot ref={ref} {...props}>
        {composeRenderProps(props.children, (children, { isRequired }) => (
          <Field
            label={label}
            description={description}
            errorMessage={errorMessage}
            isRequired={isRequired}
            necessityIndicator={necessityIndicator}
            contextualHelp={contextualHelp}
          >
            <div className="space-y-0.5">{children}</div>
          </Field>
        ))}
      </CheckboxGroupRoot>
    );
  }
);
CheckboxGroup.displayName = "CheckboxGroup";

type CheckboxGroupRootProps = Omit<AriaCheckboxGroupProps, "className"> & {
  className?: string;
};
const CheckboxGroupRoot = React.forwardRef<
  React.ElementRef<typeof AriaCheckboxGroup>,
  CheckboxGroupRootProps
>(({ className, ...props }, ref) => {
  const { root } = fieldStyles();
  return <AriaCheckboxGroup ref={ref} className={root({ className })} {...props} />;
});
CheckboxGroupRoot.displayName = "CheckboxGroupRoot";

export { CheckboxGroup };
