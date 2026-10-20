"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TextFieldPrimitives from "react-aria-components/TextField";

import { cn } from "@/lib/utils";
import { fieldStyles } from "@/components/ui/field";

/* -------------------------------------------------------------------------- */

interface TextFieldProps extends TextFieldPrimitives.TextFieldProps {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  const { field } = fieldStyles();
  return (
    <TextFieldPrimitives.TextField
      data-field=""
      data-textfield=""
      data-text-field=""
      className={composeRenderProps(className, (className) =>
        field({ className: cn("group/text-field", className) }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { TextFieldProps };
export { TextField };
