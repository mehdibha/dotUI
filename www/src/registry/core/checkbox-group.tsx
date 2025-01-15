"use client";

import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
  type ValidationResult,
} from "react-aria-components";
import { tv, VariantProps } from "tailwind-variants";
import { Label, Description, FieldError, HelpText } from "./field-01";

const checkboxGroupStyles = tv({
  slots: {
    root: "grid gap-2",
    wrapper: "grid gap-0.5",
  },
  defaultVariants: {
    variant: "default",
  },
});

const { root, wrapper } = checkboxGroupStyles();

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
          <div className={wrapper()}>{children}</div>
          <HelpText description={description} errorMessage={errorMessage} />
        </>
      ))}
    </CheckboxGroupRoot>
  );
};

interface CheckboxGroupRootProps
  extends React.ComponentProps<typeof AriaCheckboxGroup>,
    VariantProps<typeof checkboxGroupStyles> {}

const CheckboxGroupRoot = ({
  // variant,
  className,
  ...props
}: CheckboxGroupRootProps) => {
  return (
    <AriaCheckboxGroup
      className={composeRenderProps(className, (className) =>
        root({ className })
      )}
      {...props}
    />
  );
};

export type { CheckboxGroupProps, CheckboxGroupRootProps };
export { CheckboxGroup, CheckboxGroupRoot };
