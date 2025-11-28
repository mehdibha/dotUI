"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import {
  ButtonContext as AriaButtonContext,
  NumberField as AriaNumberField,
  composeRenderProps,
  Provider,
  useSlottedContext,
} from "react-aria-components";
import type * as React from "react";

import { fieldStyles } from "@dotui/registry/ui/field";

interface NumberFieldProps
  extends React.ComponentProps<typeof AriaNumberField> {}
const NumberField = ({ className, ...props }: NumberFieldProps) => {
  return (
    <AriaNumberField
      data-slot="number-field"
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <NumberFieldInner>{children}</NumberFieldInner>
      ))}
    </AriaNumberField>
  );
};

const NumberFieldInner = ({ children }: { children: React.ReactNode }) => {
  const incrementBtnCtx = useSlottedContext(AriaButtonContext, "increment");
  const decrementBtnCtx = useSlottedContext(AriaButtonContext, "decrement");
  return (
    <Provider
      values={[
        [
          AriaButtonContext,
          {
            slots: {
              increment: { ...incrementBtnCtx, children: <PlusIcon /> },
              decrement: { ...decrementBtnCtx, children: <MinusIcon /> },
            },
          },
        ],
      ]}
    >
      {children}
    </Provider>
  );
};

export type { NumberFieldProps };
export { NumberField };
