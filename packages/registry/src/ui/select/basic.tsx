"use client";

import { ChevronDownIcon } from "lucide-react";
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

import { Button } from "@dotui/registry/ui/button";
import { fieldStyles } from "@dotui/registry/ui/field";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";

const selectStyles = tv({
  slots: {
    root: fieldStyles().field(),
    selectValue: "flex-1 truncate text-left placeholder-shown:text-fg-muted",
  },
});

const { root, selectValue } = selectStyles();

/* -----------------------------------------------------------------------------------------------*/

interface SelectProps<T extends object> extends AriaSelectProps<T> {}

const Select = <T extends object>({ className, ...props }: SelectProps<T>) => {
  return (
    <AriaSelect
      data-field=""
      data-select=""
      data-slot="select"
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

const SelectTrigger = (props: ButtonProps) => {
  return (
    <Button aspect="default" {...props}>
      {composeRenderProps(props.children, (children) => {
        return (
          <>
            {children ?? <SelectValue />}
            <ChevronDownIcon className="ml-auto" />
          </>
        );
      })}
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
      data-slot="select-value"
      className={composeRenderProps(className, (className) =>
        selectValue({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectedText, defaultChildren }) => {
          return <>{children || selectedText || defaultChildren}</>;
        },
      )}
    </AriaSelectValue>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SelectContentProps<T extends object>
  extends ListBoxProps<T>,
    Pick<
      PopoverProps,
      "placement" | "defaultOpen" | "isOpen" | "onOpenChange"
    > {
  placement?: PopoverProps["placement"];
  virtulized?: boolean;
}

const SelectContent = <T extends object>({
  virtulized,
  placement,
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: SelectContentProps<T>) => {
  if (virtulized) {
    return (
      <Popover
        placement={placement}
        defaultOpen={defaultOpen}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ListBoxVirtualizer>
          <ListBox {...props} />
        </ListBoxVirtualizer>
      </Popover>
    );
  }

  return (
    <Popover
      placement={placement}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ListBox {...props} />
    </Popover>
  );
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  ListBoxItem as SelectItem,
  ListBoxSection as SelectSection,
  ListBoxSectionHeader as SelectSectionHeader,
};

export type { SelectProps, SelectValueProps, SelectContentProps };
