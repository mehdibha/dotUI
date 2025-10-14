"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
  composeRenderProps,
  ListBoxContext,
  PopoverContext,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  SelectProps as AriaSelectProps,
  SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";

import { Button } from "@dotui/registry-v2/ui/button";
import { HelpText, Label } from "@dotui/registry-v2/ui/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionTitle,
} from "@dotui/registry-v2/ui/list-box";
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
    selectValue: "flex-1 truncate text-left",
  },
});

/* -----------------------------------------------------------------------------------------------*/

const { root, selectValue } = selectStyles();
interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "selectionMode"> {}

const SelectRoot = <T extends object>({
  className,
  ...props
}: SelectProps<T>) => {
  return (
    <Provider values={[[PopoverContext, { className: "w-auto!" }]]}>
      <AriaSelect
        data-slot="select"
        className={composeRenderProps(className, (cn) =>
          root({ className: cn }),
        )}
        {...props}
      />
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const SelectTrigger = (props: ButtonProps) => {
  return (
    <Button {...props} suffix={props.suffix ?? <ChevronDownIcon />}>
      {props.children ?? <SelectValue />}
    </Button>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SelectValueProps<T extends object> extends AriaSelectValueProps<T> {}

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
      {composeRenderProps(props.children, (children, options) => {
        return <>{options.selectedText ?? options.defaultChildren}</>;
      })}
    </AriaSelectValue>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundSelect = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Popover: Popover,
  List: ListBox,
  Item: ListBoxItem,
  Section: ListBoxSection,
  Title: ListBoxSectionTitle,
});

export {
  CompoundSelect as Select,
  SelectTrigger,
  SelectValue,
  ListBox as SelectList,
  ListBoxItem as SelectItem,
  ListBoxSection as SelectSection,
  ListBoxSectionTitle as SelectSectionTitle,
};

export type { SelectProps, SelectValueProps };
