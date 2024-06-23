"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  ComboBox as AriaCombobox,
  type ComboBoxProps as AriaComboboxProps,
} from "react-aria-components";
import { Button } from "./button";
import { Field, type FieldProps, fieldStyles } from "./field";
import { Input, InputWrapper } from "./input";
import { ListBox, ListBoxItem } from "./list-box";
import { Overlay } from "./overlay";

interface ComboboxProps<T extends object>
  extends Omit<ComboboxRootProps<T>, "children">,
    Omit<FieldProps, "children"> {
  children: React.ReactNode | ((item: T) => React.ReactNode);
  items?: Iterable<T>;
}
const Combobox = <T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: ComboboxProps<T>) => {
  return (
    <ComboboxRoot {...props}>
      <Field label={label} description={description} errorMessage={errorMessage}>
        <ComboboxTrigger />
      </Field>
      <Overlay type="popover" className="min-w-[--trigger-width]">
        <ListBox items={items}>{children}</ListBox>
      </Overlay>
    </ComboboxRoot>
  );
};

const ComboboxTrigger = () => {
  return (
    <InputWrapper>
      <Input />
      <Button shape="square" className="h-full rounded-none">
        <ChevronDownIcon />
      </Button>
    </InputWrapper>
  );
};

interface ComboboxRootProps<T extends object> extends Omit<AriaComboboxProps<T>, "className"> {
  className?: string;
}
const ComboboxRoot = <T extends object>({ className, ...props }: ComboboxRootProps<T>) => {
  const { root } = fieldStyles();
  return <AriaCombobox className={root({ className })} {...props} />;
};

const ComboboxItem = ListBoxItem;

export type { ComboboxProps, ComboboxRootProps };
export { Combobox, ComboboxRoot, ComboboxTrigger, ComboboxItem };
