"use client";

import * as React from "react";
import {
  ColorField as AriaColorField,
  composeRenderProps,
} from "react-aria-components";

import { fieldStyles } from "./field";

interface ColorFieldProps extends React.ComponentProps<typeof AriaColorField> {
  placeholder?: string;
}
const ColorField = ({ className, ...props }: ColorFieldProps) => {
  return (
    <AriaColorField
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    />
  );
};

export type { ColorFieldProps };
export { ColorField };
