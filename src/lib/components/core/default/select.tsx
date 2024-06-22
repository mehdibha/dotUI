"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  type SelectProps as AriaSelectProps,
  type SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "./button";
import { Field, FieldProps, fieldStyles } from "./field";
import { ListBox, ListBoxItem } from "./list-box";
import { Overlay } from "./overlay";

// const selectStyles = tv({
//   slots: {
//     root: "",
//   },
// });

interface SelectProps<T extends object>
  extends Omit<SelectRootProps<T>, "children">,
    Omit<FieldProps, "children"> {
  children: React.ReactNode | ((item: T) => React.ReactNode);
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
        <SelectTrigger />
      </Field>
      <Overlay type="popover" className="min-w-[--trigger-width]">
        <ListBox items={items}>{children}</ListBox>
      </Overlay>
    </SelectRoot>
  );
};

const SelectTrigger = () => {
  return (
    <Button variant="outline" suffix={<ChevronDownIcon />}>
      <AriaSelectValue className="flex-1" />
    </Button>
  );
};

interface SelectValueProps<T extends object> extends AriaSelectValueProps<T> {}
const SelectValue = <T extends object>({ className, ...props }: SelectValueProps<T>) => {
  // const { root } = fieldStyles();
  return <AriaSelectValue className="flex-1" {...props} />;
};

interface SelectRootProps<T extends object> extends Omit<AriaSelectProps<T>, "className"> {
  className?: string;
}
const SelectRoot = <T extends object>({ className, ...props }: SelectRootProps<T>) => {
  const { root } = fieldStyles();
  return <AriaSelect className={root({ className })} {...props} />;
};

const SelectItem = ListBoxItem;

export type { SelectProps, SelectRootProps };
export { Select, SelectRoot, SelectTrigger, SelectItem };
