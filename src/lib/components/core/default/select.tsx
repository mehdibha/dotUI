"use client";

import * as React from "react";
import {
  composeRenderProps,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  type SelectProps as AriaSelectProps,
  type SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { ChevronDownIcon } from "@/lib/icons";
import { Button } from "./button";
import { Field, type FieldProps } from "./field";
import { ListBox } from "./list-box";
import { Overlay } from "./overlay";

const selectStyles = tv({
  slots: {
    root: "flex flex-col items-start gap-2",
    selectValue: "flex-1",
  },
});

interface SelectProps<T extends object>
  extends Omit<SelectRootProps<T>, "children">,
    Omit<FieldProps, "children"> {
  children: React.ReactNode | ((item: T) => React.ReactNode);
  items?: Iterable<T>;
  isLoading?: boolean;
}
const Select = <T extends object>({
  label,
  description,
  errorMessage,
  necessityIndicator,
  contextualHelp,
  children,
  items,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectRoot {...props}>
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
            <Button variant="outline" suffix={<ChevronDownIcon />}>
              <SelectValue />
            </Button>
          </Field>
          <Overlay type="popover">
            <ListBox items={items}>{children}</ListBox>
          </Overlay>
        </>
      )}
    </SelectRoot>
  );
};

type SelectValueProps<T extends object> = AriaSelectValueProps<T>;
const SelectValue = <T extends object>(props: SelectValueProps<T>) => {
  const { selectValue } = selectStyles();
  return (
    <AriaSelectValue
      {...props}
      className={composeRenderProps(props.className, (className) => selectValue({ className }))}
    />
  );
};

interface SelectRootProps<T extends object> extends Omit<AriaSelectProps<T>, "className"> {
  className?: string;
}
const SelectRoot = <T extends object>({ className, ...props }: SelectRootProps<T>) => {
  const { root } = selectStyles();
  return <AriaSelect className={root({ className })} {...props} />;
};

export type { SelectProps, SelectRootProps };
export { Select, SelectRoot };
