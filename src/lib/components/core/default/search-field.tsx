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
    suffix?:
      | React.ReactNode
      | (({
          isEmpty,
          isDisabled,
        }: {
          isEmpty?: boolean;
          isDisabled?: boolean;
        }) => React.ReactNode);
    isLoading?: boolean;
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
      suffix = ({ isEmpty, isDisabled }) => {
        if (isEmpty || isDisabled) return null;
        return (
          <Button variant="quiet" shape="circle" size="sm" className="size-6">
            <XIcon />
          </Button>
        );
      },
      isLoading,
      loaderPosition = "suffix",
      isRequired,
      necessityIndicator,
      contextualHelp,
      ...props
    },
    ref
  ) => {
    return (
      <SearchFieldRoot className={className} {...props}>
        {({ isEmpty, isDisabled }) => (
          <>
            <Field
              label={label}
              description={description}
              errorMessage={errorMessage}
              isRequired={isRequired}
              necessityIndicator={necessityIndicator}
              contextualHelp={contextualHelp}
            >
              <InputWrapper
                size={size}
                variant={variant}
                prefix={prefix}
                suffix={
                  typeof suffix === "function" ? suffix({ isEmpty, isDisabled }) : suffix
                }
                isLoading={isLoading}
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
