"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  ComboBox as AriaCombobox,
  type ComboBoxProps as AriaComboboxProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "@/registry/high-contrast/ui/button";
import {
  Label,
  HelpText,
  type FieldProps,
} from "@/registry/high-contrast/ui/field";
import { Input, InputRoot } from "@/registry/high-contrast/ui/input";
import {
  ListBox,
  ListBoxItem,
  ListBoxItemProps,
} from "@/registry/high-contrast/ui/list-box";
import { Overlay } from "@/registry/high-contrast/ui/overlay";

const comboboxStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
  },
});

interface ComboboxProps<T extends object>
  extends Omit<ComboboxRootProps<T>, "children">,
    Omit<FieldProps, "children"> {
  isLoading?: boolean;
  children: React.ReactNode | ((item: T) => React.ReactNode);
  items?: Iterable<T>;
}
const Combobox = <T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  isLoading,
  ...props
}: ComboboxProps<T>) => {
  return (
    <ComboboxRoot {...props}>
      {label && <Label>{label}</Label>}
      <ComboboxInput />
      <HelpText description={description} errorMessage={errorMessage} />
      <Overlay type="popover">
        <ListBox items={items} isLoading={isLoading}>
          {children}
        </ListBox>
      </Overlay>
    </ComboboxRoot>
  );
};

const ComboboxInput = () => {
  return (
    <InputRoot className="px-0">
      <Input className="pl-2" />
      <Button variant="default" shape="square" className="my-1 mr-1 size-7">
        <ChevronDownIcon />
      </Button>
    </InputRoot>
  );
};

interface ComboboxRootProps<T extends object>
  extends Omit<AriaComboboxProps<T>, "className"> {
  className?: string;
}
const ComboboxRoot = <T extends object>({
  className,
  ...props
}: ComboboxRootProps<T>) => {
  const { root } = comboboxStyles();
  return <AriaCombobox className={root({ className })} {...props} />;
};

interface ComboboxItemProps<T> extends ListBoxItemProps<T> {}
const ComboboxItem = ListBoxItem;

export type { ComboboxProps, ComboboxRootProps, ComboboxItemProps };
export { Combobox, ComboboxRoot, ComboboxInput, ComboboxItem };
