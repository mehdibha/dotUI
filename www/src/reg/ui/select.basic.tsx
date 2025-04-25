"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  composeRenderProps,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  type SelectProps as AriaSelectProps,
  type SelectValueProps as AriaSelectValueProps,
  ListBoxItemProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button, type ButtonProps } from "@/reg/ui/button_basic";
import { HelpText, Label, type FieldProps } from "@/reg/ui/field_basic";
import {
  ListBoxItem,
  ListBox,
  type ListBoxProps,
} from "@/reg/ui/list-box_basic";
import { Popover } from "@/reg/ui/popover_basic";

const selectStyles = tv({
  slots: {
    root: "flex flex-col items-start gap-2",
    selectValue: "flex-1 text-left",
  },
});

const { root, selectValue } = selectStyles();

interface SelectProps<T extends object>
  extends Omit<SelectRootProps<T>, "children">,
    FieldProps {
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
  children,
  dependencies,
  items,
  isLoading,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectRoot {...props}>
      {label && <Label>{label}</Label>}
      <Button
        variant={variant}
        size={size}
        suffix={<ChevronDownIcon />}
        className="w-full"
      >
        <SelectValue />
      </Button>
      <HelpText description={description} errorMessage={errorMessage} />
      <Popover>
        <ListBox
          isLoading={isLoading}
          items={items}
          dependencies={dependencies}
        >
          {children}
        </ListBox>
      </Popover>
    </SelectRoot>
  );
};

type SelectValueProps<T extends object> = AriaSelectValueProps<T>;
const SelectValue = <T extends object>({
  className,
  ...props
}: SelectValueProps<T>) => {
  return (
    <AriaSelectValue
      className={composeRenderProps(className, (className) =>
        selectValue({ className })
      )}
      {...props}
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
  return <AriaSelect className={root({ className })} {...props} />;
};

interface SelectItemProps<T> extends ListBoxItemProps<T> {}
const SelectItem = ListBoxItem;

export type { SelectProps, SelectRootProps, SelectItemProps, SelectValueProps };
export { Select, SelectRoot, SelectItem, SelectValue };
