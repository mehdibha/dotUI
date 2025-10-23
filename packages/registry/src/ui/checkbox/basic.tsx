"use client";

import type * as React from "react";
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { CheckIcon, MinusIcon } from "@dotui/registry/icons";
import { focusRing, focusRingGroup } from "@dotui/registry/lib/focus-styles";
import {
  createOptionalScopedContext,
  createScopedContext,
} from "@dotui/registry/lib/utils";

const checkboxStyles = tv({
  slots: {
    root: "group/checkbox flex cursor-pointer flex-row items-center gap-2 invalid:text-fg-danger disabled:cursor-default disabled:text-fg-disabled",
    indicator: [
      "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border-control",
      "bg-transparent text-transparent transition-colors duration-75 group-indeterminate/checkbox:border-transparent group-selected/checkbox:border-transparent",
      "group-read-only/checkbox:cursor-default",
      "group-disabled/checkbox:cursor-default group-disabled/checkbox:border-border-disabled group-indeterminate/checkbox:group-disabled/checkbox:bg-disabled group-selected/checkbox:group-disabled/checkbox:bg-disabled group-selected/checkbox:group-disabled/checkbox:text-fg-disabled",
      "group-invalid/checkbox:group-selected/checkbox:text-fg-onMutedDanger group-invalid/checkbox:border-border-danger group-invalid/checkbox:group-selected/checkbox:bg-danger-muted",
    ],
  },
  variants: {
    variant: {
      primary: {
        indicator:
          "group-indeterminate/checkbox:bg-primary group-indeterminate/checkbox:text-fg-on-primary group-selected/checkbox:bg-primary group-selected/checkbox:text-fg-on-primary",
      },
      accent: {
        indicator:
          "group-indeterminate/checkbox:bg-accent group-indeterminate/checkbox:text-fg-on-accent group-selected/checkbox:bg-accent group-selected/checkbox:text-fg-on-accent",
      },
    },
    appearance: {
      default: {
        indicator: focusRingGroup(),
      },
      card: {
        root: [
          focusRing(),
          "flex-row-reverse justify-between gap-4 rounded-md border p-4 transition-colors disabled:border-border-disabled disabled:selected:bg-disabled",
        ],
      },
    },
  },
  compoundVariants: [
    {
      appearance: "card",
      variant: "primary",
      className: {
        root: "selected:bg-muted",
      },
    },
    {
      appearance: "card",
      variant: "accent",
      className: {
        root: "selected:bg-accent-muted",
      },
    },
  ],
});

const { root, indicator } = checkboxStyles();

const [VariantsProvider, useVariantsContext] = createScopedContext<
  VariantProps<typeof checkboxStyles> & { isIndeterminate: boolean }
>("CheckboxRoot");

const [CheckboxProvider, useCheckboxContext] =
  createOptionalScopedContext<VariantProps<typeof checkboxStyles>>("Checkbox");

interface CheckboxProps extends CheckboxRootProps {}
const Checkbox = ({ children, ...props }: CheckboxProps) => {
  return (
    <CheckboxRoot {...props}>
      {composeRenderProps(children, (children) => (
        <>
          <CheckboxIndicator />
          {children}
        </>
      ))}
    </CheckboxRoot>
  );
};

interface CheckboxRootProps
  extends React.ComponentProps<typeof AriaCheckbox>,
    VariantProps<typeof checkboxStyles> {}

const CheckboxRoot = (localProps: CheckboxRootProps) => {
  const contextProps = useCheckboxContext();
  const {
    variant = "primary",
    appearance = "default",
    className,
    ...props
  } = {
    ...contextProps,
    ...localProps,
  };
  return (
    <AriaCheckbox
      className={composeRenderProps(className, (className) =>
        root({ variant, appearance, className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { isIndeterminate }) => (
        <VariantsProvider
          variant={variant}
          appearance={appearance}
          isIndeterminate={isIndeterminate}
        >
          {children}
        </VariantsProvider>
      ))}
    </AriaCheckbox>
  );
};

interface CheckboxIndicatorProps extends React.ComponentProps<"div"> {}

const CheckboxIndicator = ({ className, ...props }: CheckboxIndicatorProps) => {
  const { variant, appearance, isIndeterminate } =
    useVariantsContext("CheckboxIndicator");
  return (
    <div className={indicator({ variant, appearance, className })} {...props}>
      {isIndeterminate ? (
        <MinusIcon className="size-2.5" />
      ) : (
        <CheckIcon className="size-3" />
      )}
    </div>
  );
};

export type { CheckboxProps, CheckboxRootProps, CheckboxIndicatorProps };
export { Checkbox, CheckboxRoot, CheckboxIndicator };

export { CheckboxProvider };
export { checkboxStyles };
