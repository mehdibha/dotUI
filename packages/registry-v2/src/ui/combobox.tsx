"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { ComboBox as AriaCombobox } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { ComboBoxProps as AriaComboboxProps } from "react-aria-components";

import { Button } from "@dotui/registry-v2/ui/button";
import { Input } from "@dotui/registry-v2/ui/input";
import type { InputGroupProps } from "@dotui/registry-v2/ui/input";

import { ListBox, ListBoxItem } from "./list-box";
import { Popover } from "./popover";

const comboboxStyles = tv({
  slots: {
    root: "flex w-48 flex-col items-start gap-2",
  },
});

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxProps<T extends object>
  extends Omit<AriaComboboxProps<T>, "className"> {
  className?: string;
}
const Combobox = <T extends object>({
  className,
  ...props
}: ComboboxProps<T>) => {
  const { root } = comboboxStyles();
  return <AriaCombobox className={root({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

const ComboboxInput = (props: InputGroupProps) => {
  return (
    <Input.Group {...props}>
      <Input />
      <Input.Addon>
        <Button variant="quiet">
          <ChevronDownIcon />
        </Button>
      </Input.Addon>
    </Input.Group>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundCombobox = Object.assign(Combobox, {
  ComboboxInput,
  InputGroup: Input.Group,
  Input: Input,
  Addon: Input.Addon,
  Icon: ChevronDownIcon,
  Popover: Popover,
  List: ListBox,
  Item: ListBoxItem,
});

export type { ComboboxProps };
export { CompoundCombobox as Combobox, ComboboxInput };
