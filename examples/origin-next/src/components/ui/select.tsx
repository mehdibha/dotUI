"use client";

import { use } from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectPrimitives from "react-aria-components/Select";

import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { fieldStyles } from "@/components/ui/field";
import { inputStyles } from "@/components/ui/input";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@/components/ui/list-box";
import type { ListBoxProps } from "@/components/ui/list-box";
import { Popover } from "@/components/ui/popover";
import type { PopoverProps } from "@/components/ui/popover";

/* -------------------------------------------------------------------------- */

type SelectSelectionMode = "single" | "multiple";

interface SelectProps<
  T extends object,
  M extends SelectSelectionMode = "single",
> extends SelectPrimitives.SelectProps<T, M> {}

const Select = <T extends object, M extends SelectSelectionMode = "single">({
  className,
  ...props
}: SelectProps<T, M>) => {
  return (
    <SelectPrimitives.Select
      data-field=""
      data-select=""
      data-slot="select"
      className={composeRenderProps(className, (cn) =>
        fieldStyles().field({ className: cn }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

const SelectTrigger = ({ className, size, ...props }: ButtonProps) => {
  const { buttonTrigger } = inputStyles();
  // React Aria marks the Select invalid, not its button.
  const isInvalid = use(SelectPrimitives.SelectStateContext)?.displayValidation
    .isInvalid;
  return (
    <Button
      size={size}
      data-invalid={isInvalid || undefined}
      className={composeRenderProps(className, (className) =>
        buttonTrigger({ className, size: size === "xs" ? "sm" : size }),
      )}
      {...props}
    >
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

/* -------------------------------------------------------------------------- */

interface SelectValueProps<
  T extends object,
> extends SelectPrimitives.SelectValueProps<T> {}

const SelectValue = <T extends object>({
  className,
  ...props
}: SelectValueProps<T>) => {
  return (
    <SelectPrimitives.SelectValue
      data-slot="select-value"
      className={composeRenderProps(className, (className) =>
        cn(
          "flex-1 truncate text-left font-normal placeholder-shown:text-fg-muted",
          className,
        ),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectedText, defaultChildren }) =>
          children || selectedText || defaultChildren,
      )}
    </SelectPrimitives.SelectValue>
  );
};

/* -------------------------------------------------------------------------- */

interface SelectContentProps<T extends object>
  extends
    ListBoxProps<T>,
    Pick<
      PopoverProps,
      "placement" | "defaultOpen" | "isOpen" | "onOpenChange"
    > {
  virtualized?: boolean;
}

const SelectContent = <T extends object>({
  virtualized,
  placement = "bottom",
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: SelectContentProps<T>) => {
  const listBox = (
    <ListBox
      {...props}
      className={composeRenderProps(props.className, (className) =>
        cn("max-h-[inherit] overflow-auto overscroll-contain", className),
      )}
    />
  );

  return (
    <Popover
      className="overflow-hidden"
      placement={placement}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      {virtualized ? (
        <ListBoxVirtualizer>{listBox}</ListBoxVirtualizer>
      ) : (
        listBox
      )}
    </Popover>
  );
};

export type { SelectContentProps, SelectProps, SelectValueProps };
export {
  ListBoxItem as SelectItem,
  ListBoxSection as SelectSection,
  ListBoxSectionHeader as SelectSectionHeader,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
};
