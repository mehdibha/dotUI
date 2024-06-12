"use client";

import * as React from "react";
import {
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Field, fieldStyles, type FieldProps } from "../field";

const radioGroupStyles = tv({
  slots: {
    wrapper:
      "flex flex-col gap-1 orientation-horizontal:flex-row orientation-horizontal:gap-3",
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
      children,
      label,
      description,
      errorMessage,
      necessityIndicator,
      contextualHelp,
      ...props
    },
    ref
  ) => {
    const { wrapper } = radioGroupStyles();
    return (
      <RadioGroupRoot ref={ref} {...props}>
        {({ orientation, isRequired }) => (
          <Field
            label={label}
            description={description}
            errorMessage={errorMessage}
            isRequired={isRequired}
            necessityIndicator={necessityIndicator}
            contextualHelp={contextualHelp}
          >
            <div
              data-rac=""
              data-orientation={orientation || undefined}
              className={wrapper()}
            >
              {children}
            </div>
          </Field>
        )}
      </RadioGroupRoot>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupRootProps extends Omit<AriaRadioGroupProps, "className"> {
  className?: string;
}
const RadioGroupRoot = React.forwardRef<
  React.ElementRef<typeof AriaRadioGroup>,
  RadioGroupRootProps
>(({ className, ...props }, ref) => {
  const { root } = fieldStyles();
  return <AriaRadioGroup ref={ref} className={root({ className })} {...props} />;
});
RadioGroupRoot.displayName = "RadioGroupRoot";

export type { RadioGroupRootProps, RadioGroupProps };
export { RadioGroupRoot, RadioGroup };
