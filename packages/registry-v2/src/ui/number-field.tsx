"use client";

import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import {
  ButtonContext as AriaButtonContext,
  NumberField as AriaNumberField,
  composeRenderProps,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const numberFieldStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
  },
});

const { root } = numberFieldStyles();

interface NumberFieldProps
  extends React.ComponentProps<typeof AriaNumberField> {}
const NumberField = ({ className, ...props }: NumberFieldProps) => {
  return (
    <AriaNumberField
      data-slot="number-field"
      className={composeRenderProps(className, (className) =>
        root({ className }),
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
