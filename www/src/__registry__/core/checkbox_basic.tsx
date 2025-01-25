"use client";

import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import {
  createScopedContext,
  createOptionalScopedContext,
} from "@/lib/helpers";
import { focusRing, focusRingGroup } from "@/registry/lib/focus-styles";

const checkboxStyles = tv({
  slots: {
    root: "invalid:text-fg-danger disabled:text-fg-disabled group flex cursor-pointer flex-row items-center gap-2 disabled:cursor-default",
    indicator: [
      "border-border-control flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border",
      "group-selected:bg-bg-primary group-selected:text-fg-onPrimary group-selected:border-transparent bg-transparent text-transparent transition-colors duration-75",
      "group-indeterminate:bg-bg-primary group-indeterminate:text-fg-onPrimary",
      "group-read-only:cursor-default",
      "group-disabled:border-border-disabled group-selected:group-disabled:text-fg-disabled group-selected:group-disabled:bg-bg-disabled group-indeterminate:group-disabled:bg-bg-disabled group-disabled:cursor-not-allowed",
      "group-invalid:border-border-danger group-invalid:group-selected:bg-bg-danger-muted group-invalid:group-selected:text-fg-onMutedDanger",
    ],
  },
  variants: {
    variant: {
      primary: {
        indicator:
          "group-selected:bg-bg-primary group-selected:text-fg-onPrimary group-indeterminate:bg-bg-primary",
      },
      accent: {
        indicator:
          "group-selected:bg-bg-accent group-selected:text-fg-onAccent group-indeterminate:bg-bg-Accent",
      },
    },

    appearance: {
      default: {
        indicator: focusRingGroup(),
      },
      card: {
        root: [
          focusRing(),
          "selected:bg-bg-muted disabled:selected:bg-bg-disabled disabled:border-border-disabled flex-row-reverse justify-between gap-4 rounded-md border p-4 transition-colors",
        ],
      },
      emphasized: {},
    },
  },
  defaultVariants: {
    variant: "accent",
    appearance: "default",
  },
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
  const { variant, className, ...props } = { ...contextProps, ...localProps };
  return (
    <AriaCheckbox
      className={composeRenderProps(className, (className) =>
        root({ variant, className })
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { isIndeterminate }) => (
        <VariantsProvider variant={variant} isIndeterminate={isIndeterminate}>
          {children}
        </VariantsProvider>
      ))}
    </AriaCheckbox>
  );
};

interface CheckboxIndicatorProps extends React.ComponentProps<"div"> {}

const CheckboxIndicator = ({ className, ...props }: CheckboxIndicatorProps) => {
  const { variant, isIndeterminate } = useVariantsContext("CheckboxIndicator");
  return (
    <div className={indicator({ variant, className })} {...props}>
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
