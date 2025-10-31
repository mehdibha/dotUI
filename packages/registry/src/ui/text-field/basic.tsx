"use client";

import type * as React from "react";
import {
  TextField as AriaTextField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { fieldStyles } from "@dotui/registry/ui/field";

const textFieldStyles = tv({
  base: [fieldStyles().field({ orientation: "vertical" })],
});

/* -----------------------------------------------------------------------------------------------*/

interface TextFieldProps extends React.ComponentProps<typeof AriaTextField> {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  return (
    <AriaTextField
      data-slot="text-field"
      className={composeRenderProps(className, (className) =>
        textFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { TextField };

export type { TextFieldProps };
