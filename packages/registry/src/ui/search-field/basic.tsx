"use client";

import type * as React from "react";
import {
  SearchField as AriaSearchField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { fieldStyles } from "@dotui/registry/ui/field";

const searchFieldStyles = tv({
  base: [fieldStyles().field()],
});

/* -----------------------------------------------------------------------------------------------*/

interface SearchFieldProps
  extends React.ComponentProps<typeof AriaSearchField> {}

const SearchField = ({ className, ...props }: SearchFieldProps) => {
  return (
    <AriaSearchField
      data-slot="text-field"
      className={composeRenderProps(className, (className) =>
        searchFieldStyles({ className }),
      )}
      {...props}
    />
  );
};

export { SearchField };

export type { SearchFieldProps };
