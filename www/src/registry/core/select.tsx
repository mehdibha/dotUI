"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  composeRenderProps,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  type SelectProps as AriaSelectProps,
  type SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button, type ButtonProps } from "@/registry/core/button-01";
import { Field, type FieldProps } from "@/registry/core/field";
import { ListBox, type ListBoxProps } from "@/registry/core/list-box";
import { Popover } from "./popover_basic";

const selectStyles = tv({
  slots: {
    root: "flex flex-col items-start gap-2 w-48",
    selectValue: "flex-1 text-left",
  },
});

interface SelectProps<T extends object>
  extends Omit<SelectRootProps<T>, "children">,
    Omit<FieldProps, "children"> {
  children?: ListBoxProps<T>["children"];
  dependencies?: ListBoxProps<T>["dependencies"];
  items?: ListBoxProps<T>["items"];
  isLoading?: ListBoxProps<T>["isLoading"];
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}
const Select = <T extends object>({
  variant,
  size,
  label,
  description,
  errorMessage,
  necessityIndicator,
  contextualHelp,
  children,
  dependencies,
  items,
  isLoading,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectRoot {...props}>
      {({ isRequired }) => (
        <>
          <Field
            label={label}
            description={description}
            errorMessage={errorMessage}
            isRequired={isRequired}
            necessityIndicator={necessityIndicator}
            contextualHelp={contextualHelp}
          >
            <Button
              variant={variant}
              size={size}
              suffix={<ChevronDownIcon />}
              className="w-full"
            >
              <SelectValue />
            </Button>
          </Field>
          <Popover>
            <ListBox
              isLoading={isLoading}
              items={items}
              dependencies={dependencies}
            >
              {children}
            </ListBox>
          </Popover>
        </>
      )}
    </SelectRoot>
  );
};

type SelectValueProps<T extends object> = AriaSelectValueProps<T>;
const SelectValue = <T extends object>(props: SelectValueProps<T>) => {
  const { selectValue } = selectStyles();
  return (
    <AriaSelectValue
      {...props}
      className={composeRenderProps(props.className, (className) =>
        selectValue({ className })
      )}
    />
  );
};

interface SelectRootProps<T extends object>
  extends Omit<AriaSelectProps<T>, "className"> {
  className?: string;
}
const SelectRoot = <T extends object>({
  className,
  ...props
}: SelectRootProps<T>) => {
  const { root } = selectStyles();
  return <AriaSelect className={root({ className })} {...props} />;
};

export type { SelectProps, SelectRootProps, SelectValueProps };
export { Select, SelectRoot, SelectValue };
