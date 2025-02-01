"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  ComboBox as AriaCombobox,
  type ComboBoxProps as AriaComboboxProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Button } from "@/registry/core/button_basic";
import { Label, HelpText, type FieldProps } from "@/registry/core/field_basic";
import { Input, InputRoot } from "@/registry/core/input_basic";
import { ListBox } from "@/registry/core/list-box_basic";
import { Overlay } from "@/registry/core/overlay_basic";

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

export type { ComboboxProps, ComboboxRootProps };
export { Combobox, ComboboxRoot, ComboboxInput };
