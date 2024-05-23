"use client";

import * as React from "react";
import { useSlotId } from "@react-aria/utils";
import {
  Switch as AriaSwitch,
  Provider,
  SwitchContext,
  TextContext,
  type SwitchProps as AriaSwitchProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";
import { Description } from "./field";

const switchStyles = tv({
  slots: {
    root: "flex items-center gap-3",
    wrapper: [
      focusRing(),
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-50 selected:bg-border-focus bg-bg-muted",
    ],
    indicator:
      "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform selected:translate-x-5 translate-x-0",
    label: "",
  },
  variants: {
    size: {
      sm: {
        root: "",
        thumb: "",
      },
      md: {
        root: "",
        thumb: "",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SwitchProps extends SwitchBaseProps {
  description?: string;
}
const Switch = ({ description, ...props }: SwitchProps) => {
  return (
    <SwitchRoot>
      <SwitchBase {...props} />
      {description && <Description>{description}</Description>}
    </SwitchRoot>
  );
};

interface SwitchBaseProps
  extends Omit<AriaSwitchProps, "children" | "className">,
    VariantProps<typeof switchStyles> {
  children?: React.ReactNode;
  className?: string;
}

const SwitchBase = React.forwardRef<React.ElementRef<typeof AriaSwitch>, SwitchBaseProps>(
  ({ className, children, ...props }, ref) => {
    const { root, wrapper, indicator, label } = switchStyles();
    return (
      <AriaSwitch ref={ref} className={root({ className })} {...props}>
        {({
          isSelected,
          isPressed,
          isHovered,
          isFocused,
          isFocusVisible,
          isDisabled,
          isReadOnly,
        }) => (
          <>
            <span
              data-rac=""
              data-selected={isSelected || undefined}
              data-pressed={isPressed || undefined}
              data-hovered={isHovered || undefined}
              data-focused={isFocused || undefined}
              data-focus-visible={isFocusVisible || undefined}
              data-disabled={isDisabled || undefined}
              data-readonly={isReadOnly || undefined}
              className={wrapper({ className })}
            >
              <span
                data-rac=""
                data-selected={isSelected || undefined}
                data-pressed={isPressed || undefined}
                data-hovered={isHovered || undefined}
                data-focused={isFocused || undefined}
                data-focus-visible={isFocusVisible || undefined}
                data-disabled={isDisabled || undefined}
                data-readonly={isReadOnly || undefined}
                className={indicator({})}
              />
            </span>
            {children && <span className={label({})}>{children}</span>}
          </>
        )}
      </AriaSwitch>
    );
  }
);
SwitchBase.displayName = "SwitchBase";

const SwitchRoot = ({ children }: { children?: React.ReactNode }) => {
  const descriptionId = useSlotId();
  return (
    <Provider
      values={[
        [SwitchContext, { "aria-describedby": descriptionId }],
        [TextContext, { slots: { description: { id: descriptionId } } }],
      ]}
    >
      <div className="flex flex-col gap-1">{children}</div>
    </Provider>
  );
};

export { Switch };
