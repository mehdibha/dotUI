"use client";

import * as React from "react";
import { Check, ChevronDownIcon } from "lucide-react";
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type SelectProps as AriaSelectProps,
  type ListBoxItemProps as AriaListBoxItemProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "./button";
import { Field, FieldProps, fieldStyles } from "./field";
import { Overlay } from "./overlay";

const selectStyles = tv({
  slots: {
    root: "",
  },
});

interface SelectProps<T extends object>
  extends SelectRootProps<T>,
    Omit<FieldProps, "children"> {
  items?: Iterable<T>;
}
const Select = <T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectRoot {...props}>
      <Field label={label} description={description} errorMessage={errorMessage}>
        <Button suffix={<ChevronDownIcon />}>
          <AriaSelectValue className="flex-1" />
        </Button>
      </Field>
      <Overlay type="popover" className="min-w-[--trigger-width]">
        <AriaListBox className="max-h-[inherit] overflow-auto p-1 outline-none [clip-path:inset(0_0_0_0_round_.75rem)]">
          {children}
        </AriaListBox>
      </Overlay>
    </SelectRoot>
  );
};

interface SelectRootProps<T extends object>
  extends Omit<AriaSelectProps<T>, "className"> {
  className?: string;
}
const SelectRoot = <T extends object>({ className, ...props }: SelectRootProps<T>) => {
  const { root } = fieldStyles();
  return <AriaSelect className={root({ className })} {...props} />;
};

interface SelectItemProps extends Omit<AriaListBoxItemProps, "className"> {
  className?: string;
}
const SelectItem = ({ className, children, ...props }: SelectItemProps) => (
  <AriaListBoxItem
    className="data-[focused]:bg-accent data-[focused]:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    {...props}
  >
    {(values) => (
      <>
        {values.isSelected && (
          <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
            <Check className="h-4 w-4" />
          </span>
        )}
        {typeof children === "function" ? children(values) : children}
      </>
    )}
  </AriaListBoxItem>
);

export type { SelectProps, SelectRootProps };
export { Select, SelectRoot, SelectItem };
