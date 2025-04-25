"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import {
  SearchField as AriaSearchField,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import {
  Label,
  HelpText,
  type FieldProps,
} from "@/registry/material/ui/field_basic";
import {
  InputRoot,
  Input,
  type InputRootProps,
} from "@/registry/material/ui/input_basic";
import { Button } from "./button_basic";

const searchFieldtyles = tv({
  base: "group flex w-48 flex-col items-start gap-2 empty:[&_button[slot='clear']]:hidden [&_input]:[&::-webkit-search-cancel-button]:appearance-none [&_input]:[&::-webkit-search-decoration]:appearance-none",
});

interface SearchFieldProps
  extends SearchFieldRootProps,
    Pick<InputRootProps, "size">,
    FieldProps {}

const SearchField = ({
  label,
  description,
  errorMessage,
  size,
  ...props
}: SearchFieldProps) => {
  return (
    <SearchFieldRoot {...props}>
      {label && <Label>{label}</Label>}
      <InputRoot size={size}>
        <SearchIcon />
        <Input />
        <Button
          slot="clear"
          variant="quiet"
          size="sm"
          shape="circle"
          className="size-6"
        >
          <XIcon />
        </Button>
      </InputRoot>
      <HelpText description={description} errorMessage={errorMessage} />
    </SearchFieldRoot>
  );
};

interface SearchFieldRootProps
  extends React.ComponentProps<typeof AriaSearchField> {
  placeholder?: string;
}
const SearchFieldRoot = ({ className, ...props }: SearchFieldRootProps) => {
  return (
    <AriaSearchField
      className={composeRenderProps(className, (className) =>
        searchFieldtyles({ className })
      )}
      {...props}
    />
  );
};

export type { SearchFieldProps, SearchFieldRootProps };
export { SearchField, SearchFieldRoot };
