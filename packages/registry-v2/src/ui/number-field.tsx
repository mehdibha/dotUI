"use client";

import type * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  ButtonContext as AriaButtonContext,
  NumberField as AriaNumberField,
  composeRenderProps,
  Provider,
} from "react-aria-components";

import { fieldStyles } from "./field";

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
        <Provider
          values={[
            [
              AriaButtonContext,
              {
                slots: {
                  increment: { children: <PlusIcon /> },
                  decrement: { children: <MinusIcon /> },
                },
              },
            ],
          ]}
        >
          {children}
        </Provider>
      ))}
    </AriaNumberField>
  );
};

export type { NumberFieldProps };
export { NumberField };
