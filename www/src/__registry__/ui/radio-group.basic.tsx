"use client";

import type { ValidationResult } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import * as React from "react";
import { HelpText, Label } from "@/components/dynamic-ui/field";
import { focusRing, focusRingGroup } from "@/registry/lib/focus-styles";
import {
  createOptionalScopedContext,
  createScopedContext,
} from "@/registry/lib/utils";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const radioStyles = tv({
  slots: {
    root: "disabled:text-fg-disabled invalid:text-fg-danger group flex cursor-pointer flex-row items-center gap-2 disabled:cursor-default",
    indicator: [
      focusRing(),
      "border-border-control group-selected:border-bg-primary group-selected:border-4 relative size-4 shrink-0 rounded-full border transition-all duration-100",
      "group-disabled:border-border-disabled selected:group-disabled:bg-bg-disabled indeterminate:group-disabled:bg-bg-disabled",
      "group-invalid:border-border-danger group-invalid:selected:border-bg-danger",
    ],
  },
  variants: {
    variant: {
      default: {
        indicator: focusRingGroup(),
      },
      card: {
        root: [
          focusRing(),
          "selected:bg-bg-muted disabled:selected:bg-bg-disabled disabled:border-border-disabled flex-row-reverse gap-4 rounded-md border p-4 transition-colors",
        ],
      },
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const { root, indicator } = radioStyles();

const [VariantsProvider, useVariantsContext] =
  createScopedContext<VariantProps<typeof radioStyles>>("RadioRoot");

const [RadioProvider, useRadioContext] =
  createOptionalScopedContext<VariantProps<typeof radioStyles>>("Radio");

interface RadioProps extends RadioRootProps {}
const Radio = ({ children, ...props }: RadioProps) => {
  return (
    <RadioRoot {...props}>
      {composeRenderProps(children, (children) => (
        <>
          <RadioIndicator />
          {children}
        </>
      ))}
    </RadioRoot>
  );
};

interface RadioRootProps
  extends React.ComponentProps<typeof AriaRadio>,
    VariantProps<typeof radioStyles> {}

const RadioRoot = (localProps: RadioRootProps) => {
  const contextProps = useRadioContext();
  const { variant, className, ...props } = { ...contextProps, ...localProps };
  return (
    <VariantsProvider variant={variant}>
      <AriaRadio
        className={composeRenderProps(className, (className) =>
          root({ variant, className }),
        )}
        {...props}
      />
    </VariantsProvider>
  );
};

interface RadioIndicatorProps extends React.ComponentProps<"div"> {}

const RadioIndicator = ({ className, ...props }: RadioIndicatorProps) => {
  const { variant } = useVariantsContext("RadioIndicator");
  return <div className={indicator({ variant, className })} {...props} />;
};

const radioGroupStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    wrapper: "flex gap-1",
  },
  variants: {
    orientation: {
      horizontal: {
        wrapper: "flex-row gap-2",
      },
      vertical: {
        wrapper: "flex-col",
      },
    },
  },
});

const { root: radioGroupRoot, wrapper } = radioGroupStyles();

interface RadioGroupProps extends RadioGroupRootProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

const RadioGroup = ({
  label,
  description,
  errorMessage,
  children,
  ...props
}: RadioGroupProps) => {
  return (
    <RadioGroupRoot {...props}>
      {composeRenderProps(children, (children, { orientation }) => (
        <>
          {label && <Label>{label}</Label>}
          <div className={wrapper({ orientation })}>{children}</div>
          <HelpText description={description} errorMessage={errorMessage} />
        </>
      ))}
    </RadioGroupRoot>
  );
};

interface RadioGroupRootProps
  extends React.ComponentProps<typeof AriaRadioGroup>,
    VariantProps<typeof radioGroupStyles>,
    VariantProps<typeof radioStyles> {}

const RadioGroupRoot = ({
  variant,
  className,
  ...props
}: RadioGroupRootProps) => {
  return (
    <RadioProvider variant={variant}>
      <AriaRadioGroup
        className={composeRenderProps(className, (className) =>
          radioGroupRoot({ className }),
        )}
        {...props}
      />
    </RadioProvider>
  );
};

export type { RadioProps, RadioRootProps, RadioIndicatorProps };
export { Radio, RadioRoot, RadioIndicator };

export type { RadioGroupProps, RadioGroupRootProps };
export { RadioGroup, RadioGroupRoot };
