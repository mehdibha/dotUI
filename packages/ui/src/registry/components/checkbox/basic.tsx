"use client";

import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { focusRing, focusRingGroup } from "@dotui/ui/lib/focus-styles";
import {
  createOptionalScopedContext,
  createScopedContext,
} from "@dotui/ui/lib/utils";

const checkboxStyles = tv({
  slots: {
    root: "group flex cursor-pointer flex-row items-center gap-2 invalid:text-fg-danger disabled:cursor-default disabled:text-fg-disabled",
    indicator: [
      "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-border-control",
      "bg-transparent text-transparent transition-colors duration-75 group-indeterminate:border-transparent group-selected:border-transparent",
      "group-read-only:cursor-default",
      "group-disabled:cursor-default group-disabled:border-border-disabled group-indeterminate:group-disabled:bg-bg-disabled group-selected:group-disabled:bg-bg-disabled group-selected:group-disabled:text-fg-disabled",
      "group-invalid:group-selected:text-fg-onMutedDanger group-invalid:border-border-danger group-invalid:group-selected:bg-bg-danger-muted",
    ],
  },
  variants: {
    variant: {
      primary: {
        indicator:
          "group-indeterminate:bg-bg-primary group-indeterminate:text-fg-onPrimary group-selected:bg-bg-primary group-selected:text-fg-onPrimary",
      },
      accent: {
        indicator:
          "group-indeterminate:bg-bg-Accent group-indeterminate:text-fg-onAccent group-selected:bg-bg-accent group-selected:text-fg-onAccent",
      },
    },
    appearance: {
      default: {
        indicator: focusRingGroup(),
      },
      card: {
        root: [
          focusRing(),
          "flex-row-reverse justify-between gap-4 rounded-md border p-4 transition-colors disabled:border-border-disabled disabled:selected:bg-bg-disabled",
        ],
      },
    },
  },
  compoundVariants: [
    {
      appearance: "card",
      variant: "primary",
      className: {
        root: "selected:bg-bg-muted",
      },
    },
    {
      appearance: "card",
      variant: "accent",
      className: {
        root: "selected:bg-bg-accent-muted",
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
