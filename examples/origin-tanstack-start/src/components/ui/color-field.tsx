"use client";

import type * as React from "react";
import * as ColorFieldPrimitives from "react-aria-components/ColorField";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { fieldStyles as useStyles } from "@/components/ui/field";

interface ColorFieldProps extends React.ComponentProps<
  typeof ColorFieldPrimitives.ColorField
> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
  const fieldStyles = useStyles;
  return (
    <ColorFieldPrimitives.ColorField
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ orientation: "vertical", className }),
      )}
      {...props}
    />
  );
};

export type { ColorFieldProps };
export { ColorField };
