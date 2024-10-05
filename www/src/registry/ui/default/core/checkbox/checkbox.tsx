"use client";

import * as React from "react";
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
  type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import {
  focusRing,
  focusRingGroup,
} from "@/registry/ui/default/lib/focus-styles";
import { CheckIcon, MinusIcon } from "@/__icons__";

const checkboxStyles = tv({
  slots: {
    root: "invalid:text-fg-danger disabled:text-fg-disabled group flex cursor-pointer flex-row items-center gap-2 disabled:cursor-default",
    indicator: [
      "border-border-control flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border",
      "group-selected:bg-bg-primary group-selected:text-fg-onPrimary group-selected:border-transparent bg-transparent text-transparent transition-colors duration-75",
      "group-indeterminate:bg-bg-primary group-indeterminate:text-fg-onPrimary",
      "group-read-only:cursor-default",
      "group-disabled:border-border-disabled group-disabled:group-selected:text-fg-disabled group-disabled:group-selected:bg-bg-disabled group-disabled:group-indeterminate:bg-bg-disabled group-disabled:cursor-not-allowed",
      "group-invalid:border-border-danger group-invalid:group-selected:bg-bg-danger-muted group-invalid:group-selected:text-fg-onMutedDanger",
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

interface CheckboxProps
  extends Omit<AriaCheckboxProps, "className">,
    VariantProps<typeof checkboxStyles> {
  className?: string;
}
const Checkbox = React.forwardRef<
  React.ElementRef<typeof AriaCheckbox>,
  CheckboxProps
>((localProps, ref) => {
  const contextProps = useCheckboxContext();
  const props = { ...contextProps, ...localProps };
  const { className, variant, ...restProps } = props;
  const { root, indicator } = checkboxStyles({ variant });
  return (
    <AriaCheckbox ref={ref} {...restProps} className={root({ className })}>
      {composeRenderProps(props.children, (children, { isIndeterminate }) => (
        <>
          <div className={indicator({ className: "" })}>
            {isIndeterminate ? (
              <MinusIcon className="size-2.5" />
            ) : (
              <CheckIcon className="size-3" />
            )}
          </div>
          <span>{children}</span>
        </>
      ))}
    </AriaCheckbox>
  );
});
Checkbox.displayName = "Checkbox";

type CheckboxContextValue = VariantProps<typeof checkboxStyles>;
const CheckboxContext = React.createContext<CheckboxContextValue>({});
const useCheckboxContext = () => {
  return React.useContext(CheckboxContext);
};

export type { CheckboxProps };
export { Checkbox, CheckboxContext };
