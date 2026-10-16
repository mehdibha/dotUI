"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TextFieldPrimitive from "react-aria-components/TextField";

import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface TextFieldProps extends TextFieldPrimitive.TextFieldProps {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  return (
    <TextFieldPrimitive.TextField
      data-field=""
      data-textfield=""
      data-slot="text-field"
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { TextFieldProps };
export { TextField };
