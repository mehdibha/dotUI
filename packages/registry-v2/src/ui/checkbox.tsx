"use client";

import * as React from "react";
import { CheckIcon, MinusIcon } from "lucide-react";
import {
  Checkbox as AriaCheckbox,
  composeRenderProps,
  useRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { CheckboxRenderProps } from "react-aria-components";

import { createContext } from "../lib/utils";

const checkboxStyles = tv({
  slots: {
    root: ["flex items-start gap-2"],
    indicator: [
      "flex size-4 shrink-0 items-center justify-center rounded-sm border border-border-control bg-transparent text-transparent transition-colors duration-75",
      // selected state
      "selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
      // read-only state
      "read-only:cursor-default",
      // disabled state
      "disabled:cursor-default disabled:border-border-disabled indeterminate:disabled:bg-disabled selected:disabled:bg-disabled selected:disabled:text-fg-disabled",
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

interface CheckboxProps extends React.ComponentProps<typeof AriaCheckbox> {}

const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <AriaCheckbox
      className={composeRenderProps(className, (cn) =>
        props.children ? root({ className: cn }) : indicator({ className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, renderProps) => {
        return (
          <InternalCheckboxProvider value={renderProps}>
            {children ??
              (renderProps.isIndeterminate ? (
                <MinusIcon className="size-3" />
              ) : (
                <CheckIcon className="size-3" />
              ))}
          </InternalCheckboxProvider>
        );
      })}
    </AriaCheckbox>
  );
};

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
