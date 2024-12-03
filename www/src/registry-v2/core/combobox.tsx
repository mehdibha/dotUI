"use client";

import * as React from "react";
import {
  ComboBox as AriaCombobox,
  type ComboBoxProps as AriaComboboxProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { ChevronDownIcon } from "@/__icons__";
import { Button } from "@/registry-v2/core/button";
import { Field, type FieldProps } from "@/registry-v2/core/field";
import { Input, InputRoot } from "@/registry-v2/core/input";
import { ListBox } from "@/registry-v2/core/list-box";
import { Overlay } from "@/registry-v2/core/overlay";

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
  necessityIndicator,
  contextualHelp,
  children,
  items,
  isLoading,
  ...props
}: ComboboxProps<T>) => {
  return (
    <ComboboxRoot {...props}>
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
            <ComboboxTrigger />
          </Field>
          <Overlay type="popover">
            <ListBox items={items} isLoading={isLoading}>
              {children}
            </ListBox>
          </Overlay>
        </>
      )}
    </ComboboxRoot>
  );
};

const ComboboxTrigger = () => {
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
export { Combobox, ComboboxRoot, ComboboxTrigger };
