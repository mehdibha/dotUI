"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";
import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
} from "react-aria-components";
import { type VariantProps } from "tailwind-variants";
import { Button } from "./button";
import { fieldStyles } from "./field";
import { Field, type FieldProps } from "./field";
import { InputWrapper, Input, inputStyles } from "./input";

type SearchFieldProps = SearchFieldRootProps &
  Omit<FieldProps, "children"> &
  VariantProps<typeof inputStyles> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    loading?: boolean;
    loaderPosition?: "prefix" | "suffix";
    placeholder?: string;
  };
const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      className,
      variant,
      size,
      placeholder,
      label,
      description,
      errorMessage,
      prefix = <SearchIcon />,
      suffix = (
        <Button variant="quiet" shape="circle" size="sm" className="size-6">
          <XIcon />
        </Button>
      ),
      loading,
      loaderPosition = "suffix",
      ...props
    },
    ref
  ) => {
    return (
      <SearchFieldRoot className={className} {...props}>
        {({ isEmpty }) => (
          <>
            <Field label={label} description={description} errorMessage={errorMessage}>
              <InputWrapper
                size={size}
                variant={variant}
                prefix={prefix}
                suffix={!isEmpty && suffix}
                loading={loading}
                loaderPosition={loaderPosition}
              >
                <Input
                  ref={ref}
                  placeholder={placeholder}
                  className="[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                />
              </InputWrapper>
            </Field>
          </>
        )}
      </SearchFieldRoot>
    );
  }
);
SearchField.displayName = "SearchField";

type SearchFieldRootProps = Omit<AriaSearchFieldProps, "className"> & {
  className?: string;
};
const SearchFieldRoot = React.forwardRef<
  React.ElementRef<typeof AriaSearchField>,
  SearchFieldRootProps
>(({ className, ...props }, ref) => {
  const { root } = fieldStyles();
  return <AriaSearchField ref={ref} className={root({ className })} {...props} />;
});
SearchFieldRoot.displayName = "SearchFieldRoot";

export type { SearchFieldProps, SearchFieldRootProps };
export { SearchField, SearchFieldRoot };
