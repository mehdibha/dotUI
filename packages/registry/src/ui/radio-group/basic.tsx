"use client";

import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { RadioGroupProps, RadioRenderProps } from "react-aria-components";

import { createContext } from "@dotui/registry/lib/context";
import { cn } from "@dotui/registry/lib/utils";
import { fieldStyles } from "@dotui/registry/ui/field";

const { field } = fieldStyles();

const RadioGroup = ({ className, ...props }: RadioGroupProps) => {
  return (
    <AriaRadioGroup
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const radioStyles = tv({
  slots: {
    root: ["flex items-center gap-2 has-data-[slot=description]:items-start"],
    indicator: [
      "flex size-4 shrink-0 items-center justify-center rounded-full border border-border-control bg-transparent text-transparent",
      "transition-[background-color,border-color,box-shadow,color] duration-75",
      // focus state
      // selected state
      "selected:border-transparent selected:bg-primary selected:text-fg-on-primary",
      // read-only state
      "read-only:cursor-default",
      // disabled state
      "disabled:cursor-default disabled:border-border-disabled selected:disabled:bg-disabled selected:disabled:text-fg-disabled indeterminate:disabled:bg-disabled",
      // invalid state
      "invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-onMutedDanger",
      // indeterminate state
      "indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary",
    ],
  },
});

const { root, indicator } = radioStyles();

const [InternalRadioProvider, useInternalRadio] =
  createContext<RadioRenderProps>({
    strict: true,
  });

interface RadioProps extends React.ComponentProps<typeof AriaRadio> {}

const Radio = ({ className, ...props }: RadioProps) => {
  return (
    <AriaRadio
      data-slot="radio"
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
          <InternalRadioProvider value={renderProps}>
            {children}
          </InternalRadioProvider>
        ) : (
          <span />
        );
      })}
    </AriaRadio>
  );
};

interface RadioIndicatorProps extends React.ComponentProps<"div"> {}

const RadioIndicator = ({ className, ...props }: RadioIndicatorProps) => {
  const ctx = useInternalRadio("RadioIndicator");
  return (
    <div
      data-rac=""
      data-selected={ctx.isSelected || undefined}
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
      <span />
    </div>
  );
};
/* -----------------------------------------------------------------------------------------------*/

export { RadioGroup, Radio, RadioIndicator };

export type { RadioGroupProps, RadioProps, RadioIndicatorProps };
