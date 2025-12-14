"use client";

import {
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
} from "react-aria-components";
import type { CheckboxGroupProps } from "react-aria-components";

import { fieldStyles } from "@dotui/registry/ui/field";

const { field } = fieldStyles();

const CheckboxGroup = ({ className, ...props }: CheckboxGroupProps) => {
  return (
    <AriaCheckboxGroup
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    />
  );
};

export type { CheckboxGroupProps };
export { CheckboxGroup };
