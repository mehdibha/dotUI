"use client";

import type * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { CheckboxRenderProps } from "react-aria-components";

import { cn, createContext } from "@dotui/registry/lib/utils";

const checkboxStyles = tv({
  slots: {
    root: [
      "focus-reset focus-visible:focus-ring",
      "flex items-center gap-2 text-sm leading-none has-data-[slot=description]:items-start",
      "disabled:cursor-not-allowed disabled:text-fg-disabled",
    ],
    indicator: [
      "flex size-4 shrink-0 items-center justify-center rounded-sm border border-border-control bg-transparent text-transparent",
      "transition-[background-color,border-color,box-shadow,color] duration-75",
      // selected state
      "selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
      // read-only state
      "read-only:cursor-default",
      // disabled state
      "disabled:cursor-not-allowed disabled:border-border-disabled indeterminate:disabled:bg-disabled selected:disabled:bg-disabled selected:disabled:text-fg-disabled",
      // invalid state
      "invalid:selected:text-fg-onMutedDanger invalid:border-border-danger invalid:selected:bg-danger-muted",
      // indeterminate state
      "indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
    ],
  },
});

const { root, indicator } = checkboxStyles();

const [InternalCheckboxProvider, useInternalCheckbox] =
  createContext<CheckboxRenderProps>({
    strict: true,
  });

/* -----------------------------------------------------------------------------------------------*/

interface CheckboxProps extends React.ComponentProps<typeof AriaCheckbox> {}

const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <AriaCheckbox
      data-slot="checkbox"
      className={composeRenderProps(className, (className) =>
        props.children
          ? root({ className })
          : indicator({
              className: cn(className, "focus-reset focus-visible:focus-ring"),
            }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, renderProps) => {
        return children ? (
          <InternalCheckboxProvider value={renderProps}>
            {children}
          </InternalCheckboxProvider>
        ) : renderProps.isIndeterminate ? (
          <MinusIcon className="size-3" />
        ) : (
          <CheckIcon className="size-3" />
        );
      })}
    </AriaCheckbox>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CheckboxIndicatorProps extends React.ComponentProps<"div"> {}

const CheckboxIndicator = ({ className, ...props }: CheckboxIndicatorProps) => {
  const ctx = useInternalCheckbox("CheckboxIndicator");
  return (
    <div
      data-rac=""
      data-selected={ctx.isSelected || undefined}
      data-indeterminate={ctx.isIndeterminate || undefined}
      data-pressed={ctx.isPressed || undefined}
      data-hovered={ctx.isHovered || undefined}
      data-focused={ctx.isFocused || undefined}
      data-focus-visible={ctx.isFocusVisible || undefined}
      data-disabled={ctx.isDisabled || undefined}
      data-readonly={ctx.isReadOnly || undefined}
      data-invalid={ctx.isInvalid || undefined}
      data-required={ctx.isRequired || undefined}
      className={indicator({ className })}
      {...props}
    >
      {ctx.isIndeterminate ? (
        <MinusIcon className="size-2.5" />
      ) : (
        <CheckIcon className="size-3" />
      )}
    </div>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Checkbox, CheckboxIndicator };

export type { CheckboxProps, CheckboxIndicatorProps };
