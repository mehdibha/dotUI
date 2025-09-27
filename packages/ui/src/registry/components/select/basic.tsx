"use client";

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

import { Button } from "@dotui/ui/components/button";
import { HelpText, Label } from "@dotui/ui/components/field";
import { ListBox, ListBoxItem } from "@dotui/ui/components/list-box";
import { Popover } from "@dotui/ui/components/popover";
import { ChevronDownIcon } from "@dotui/ui/icons";
import type { ButtonProps } from "@dotui/ui/components/button";
import type { FieldProps } from "@dotui/ui/components/field";
import type {
  ListBoxItemProps,
  ListBoxProps,
} from "@dotui/ui/components/list-box";

const selectStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
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
  renderValue,
  suffix,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectRoot {...props}>
      {label && <Label>{label}</Label>}
      <Button
        variant={variant}
        size={size}
        suffix={suffix ?? <ChevronDownIcon />}
        className="w-full"
      >
        <SelectValue>{renderValue}</SelectValue>
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

export type { SelectProps, SelectRootProps, SelectItemProps, SelectValueProps };
export { Select, SelectRoot, SelectItem, SelectValue };
