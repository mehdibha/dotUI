"use client";

import type { ValidationResult } from "react-aria-components";
import {
  CheckboxProvider,
  checkboxStyles,
} from "@/components/dynamic-ui/checkbox";
import { HelpText, Label } from "@/components/dynamic-ui/field";
import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";

const checkboxGroupStyles = tv({
  base: "flex flex-col gap-2",
});

interface CheckboxGroupProps extends CheckboxGroupRootProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

const CheckboxGroup = ({
  label,
  description,
  errorMessage,
  children,
  ...props
}: CheckboxGroupProps) => {
  return (
    <CheckboxGroupRoot {...props}>
      {composeRenderProps(children, (children) => (
        <>
          {label && <Label>{label}</Label>}
          {children}
          <HelpText description={description} errorMessage={errorMessage} />
        </>
      ))}
    </CheckboxGroupRoot>
  );
};

interface CheckboxGroupRootProps
  extends React.ComponentProps<typeof AriaCheckboxGroup>,
    VariantProps<typeof checkboxGroupStyles>,
    VariantProps<typeof checkboxStyles> {}

const CheckboxGroupRoot = ({
  variant,
  className,
  ...props
}: CheckboxGroupRootProps) => {
  return (
    <CheckboxProvider variant={variant}>
      <AriaCheckboxGroup
        className={composeRenderProps(className, (className) =>
          checkboxGroupStyles({ className })
        )}
        {...props}
      />
    </CheckboxProvider>
  );
};

export type { CheckboxGroupProps, CheckboxGroupRootProps };
export { CheckboxGroup, CheckboxGroupRoot };
