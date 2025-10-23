"use client";

import type * as React from "react";
import {
  SearchField as AriaSearchField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Description, FieldError, Label } from "./field";
import { Input, InputAddon, InputGroup, TextArea } from "./input";

const searchFieldStyles = tv({
  base: "flex w-48 flex-col items-start gap-2",
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

/* -----------------------------------------------------------------------------------------------*/

const CompoundSearchField = Object.assign(SearchField, {
  Input,
  TextArea,
  InputGroup,
  InputAddon,
  Label,
  Description,
  FieldError,
});

export { CompoundSearchField as SearchField };

export type { SearchFieldProps };
