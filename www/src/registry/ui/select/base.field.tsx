"use client"

import { use } from "react"
import * as ButtonPrimitive from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as SelectPrimitives from "react-aria-components/Select"

import { ChevronDownIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { useStyles } from "@/registry/ui/field/styles"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@/registry/ui/list-box"
import type { ListBoxProps } from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover"
import type { PopoverProps } from "@/registry/ui/popover"

// MARK: selectStyles

// MARK: Separator

type SelectSelectionMode = "single" | "multiple"

interface SelectProps<
  T extends object,
  M extends SelectSelectionMode = "single",
> extends SelectPrimitives.SelectProps<T, M> {}

const Select = <T extends object, M extends SelectSelectionMode = "single">({
  className,
  ...props
}: SelectProps<T, M>) => {
  const fieldStyles = useStyles()
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
  )
}

// MARK: Separator

interface SelectTriggerProps extends ButtonPrimitive.ButtonProps {
  size?: "sm" | "md" | "lg"
}

const SelectTrigger = ({ className, size, ...props }: SelectTriggerProps) => {
  const { trigger } = useInputStyles()()
  // React Aria marks the Select invalid, not its button.
  const isInvalid = use(SelectPrimitives.SelectStateContext)?.displayValidation
    .isInvalid
  return (
    <ButtonPrimitive.Button
      data-select-trigger=""
      data-size={size}
      data-invalid={isInvalid || undefined}
      className={composeRenderProps(className, (className) =>
        trigger({ className, size }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => {
        return (
          <>
            {children ?? <SelectValue />}
            <ChevronDownIcon className="ml-auto" />
          </>
        )
      })}
    </ButtonPrimitive.Button>
  )
}

// MARK: Separator

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
          "flex-1 truncate text-left placeholder-shown:text-fg-muted",
          className,
        ),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectedText, defaultChildren }) => {
          return <>{children || selectedText || defaultChildren}</>
        },
      )}
    </SelectPrimitives.SelectValue>
  )
}

// MARK: Separator

interface SelectContentProps<T extends object>
  extends
    ListBoxProps<T>,
    Pick<
      PopoverProps,
      "placement" | "defaultOpen" | "isOpen" | "onOpenChange"
    > {
  placement?: PopoverProps["placement"]
  virtulized?: boolean
}

const SelectContent = <T extends object>({
  virtulized,
  placement = "bottom",
  defaultOpen,
  isOpen,
  onOpenChange,
  ...props
}: SelectContentProps<T>) => {
  const listBoxClassName = composeRenderProps(props.className, (className) =>
    cn("max-h-[inherit] overflow-auto overscroll-contain", className),
  )

  if (virtulized) {
    return (
      <Popover
        className="overflow-hidden"
        placement={placement}
        defaultOpen={defaultOpen}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ListBoxVirtualizer>
          <ListBox {...props} className={listBoxClassName} />
        </ListBoxVirtualizer>
      </Popover>
    )
  }

  return (
    <Popover
      className="overflow-hidden"
      placement={placement}
      defaultOpen={defaultOpen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ListBox {...props} className={listBoxClassName} />
    </Popover>
  )
}

export type {
  SelectContentProps,
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
}
export {
  ListBoxItem as SelectItem,
  ListBoxSection as SelectSection,
  ListBoxSectionHeader as SelectSectionHeader,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
}
