"use client";

import * as React from "react";
import {
  ColorField as AriaColorField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const colorFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
});

interface ColorFieldProps extends React.ComponentProps<typeof AriaColorField> {
  placeholder?: string;
}
const ColorField = ({ className, ...props }: ColorFieldProps) => {
  return (
    <AriaColorField
      className={composeRenderProps(className, (className) =>
        colorFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

export type { ColorFieldProps };
export { ColorField };
