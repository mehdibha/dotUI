"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  SelectProps as AriaSelectProps,
  SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";

import { Button } from "@dotui/registry-v2/ui/button";
import { HelpText, Label } from "@dotui/registry-v2/ui/field";
import { ListBox, ListBoxItem } from "@dotui/registry-v2/ui/list-box";
import { Popover } from "@dotui/registry-v2/ui/popover";
import type { ButtonProps } from "@dotui/registry-v2/ui/button";
import type { FieldProps } from "@dotui/registry-v2/ui/field";
import type {
  ListBoxItemProps,
  ListBoxProps,
} from "@dotui/registry-v2/ui/list-box";

const selectStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2 [&_[data-slot='button']]:w-full",
    selectValue: "flex-1 text-left",
  },
});

const { root, selectValue } = selectStyles();

interface SelectProps<T extends object>
  extends Omit<SelectRootProps<T>, "children">,
    FieldProps,
    Pick<ListBoxProps<T>, "children" | "dependencies" | "items" | "isLoading">,
    Pick<ButtonProps, "variant" | "size" | "suffix"> {
  renderValue?: SelectValueProps<T>["children"];
}
const SelectBase = <T extends object>({
  variant,
  size,
  label,
  description,
  errorMessage,
  children,
  dependencies,
  items,
  isLoading,
  renderValue,
  suffix,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectRoot {...props}>
      {label && <Label>{label}</Label>}
      <SelectButton variant={variant} size={size} suffix={suffix}>
        <SelectValue>{renderValue}</SelectValue>
      </SelectButton>
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

const SelectButton = (props: ButtonProps) => {
  return <Button {...props} suffix={props.suffix ?? <ChevronDownIcon />} />;
};

type SelectValueProps<T extends object> = AriaSelectValueProps<T>;
const SelectValue = <T extends object>({
  className,
  ...props
}: SelectValueProps<T>) => {
  return (
    <AriaSelectValue
      className={composeRenderProps(className, (className) =>
        selectValue({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, { selectedText }) => (
        <>{children ?? selectedText}</>
      ))}
    </AriaSelectValue>
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

const Select = Object.assign(SelectBase, {
  Root: SelectRoot,
  Button: SelectButton,
  Value: SelectValue,
  Item: SelectItem,
  ListBox: ListBox,
  Popover: Popover,
});

export type { SelectProps, SelectRootProps, SelectItemProps, SelectValueProps };
export { Select, SelectRoot, SelectItem, SelectValue };
