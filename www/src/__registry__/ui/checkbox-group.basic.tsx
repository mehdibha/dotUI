"use client";

import type { checkboxStyles } from "@/registry/ui/checkbox.basic";
import type { ValidationResult } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { CheckboxProvider } from "@/registry/ui/checkbox.basic";
import { HelpText, Label } from "@/registry/ui/field.basic";
import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

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
          checkboxGroupStyles({ className }),
        )}
        {...props}
      />
    </CheckboxProvider>
  );
};

export type { CheckboxGroupProps, CheckboxGroupRootProps };
export { CheckboxGroup, CheckboxGroupRoot };
