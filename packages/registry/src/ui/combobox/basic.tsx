"use client";

import React from "react";
import { useResizeObserver } from "@react-aria/utils";
import { ChevronDownIcon } from "lucide-react";
import { mergeProps } from "react-aria";
import {
  ComboBox as AriaCombobox,
  GroupContext as AriaGroupContext,
  PopoverContext as AriaPopoverContext,
  composeRenderProps,
  Provider,
} from "react-aria-components";
import type { ComboBoxProps as AriaComboboxProps } from "react-aria-components";

import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import { fieldStyles } from "@dotui/registry/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import type { InputGroupProps } from "@dotui/registry/ui/input";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxProps<T extends object>
  extends Omit<AriaComboboxProps<T>, "className"> {
  className?: string;
}
const Combobox = <T extends object>({
  menuTrigger = "focus",
  className,
  ...props
}: ComboboxProps<T>) => {
  return (
    <AriaCombobox
      menuTrigger={menuTrigger}
      className={fieldStyles().field({
        className: cn(className),
      })}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <ComboboxInner>{children}</ComboboxInner>
      ))}
    </AriaCombobox>
  );
};

/* -----------------------------------------------------------------------------------------------*/

/**
 *  This abstraction allows the Combobox to work with InputGroup and
 *  sync the trigger width with the popover dropdown.
 */

const ComboboxInner = ({ children }: { children: React.ReactNode }) => {
  const [menuWidth, setMenuWidth] = React.useState<string | undefined>(
    undefined,
  );

  const groupProps = React.use(AriaGroupContext);
  const popoverProps = React.use(AriaPopoverContext);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const onResize = React.useCallback(() => {
    if (triggerRef.current) {
      const triggerWidth = triggerRef.current.getBoundingClientRect().width;
      setMenuWidth(`${triggerWidth}px`);
    }
  }, []);

  useResizeObserver({
    ref: triggerRef,
    onResize: onResize,
  });

  return (
    <Provider
      values={[
        [AriaGroupContext, mergeProps(groupProps, { ref: triggerRef })],
        [
          AriaPopoverContext,
          triggerRef.current
            ? {
                ...mergeProps(popoverProps, {
                  style: {
                    "--trigger-width": menuWidth,
                  } as React.CSSProperties,
                }),
                triggerRef,
              }
            : popoverProps,
        ],
      ]}
    >
      {children}
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxInputProps extends InputGroupProps {}

const ComboboxInput = (props: ComboboxInputProps) => {
  return (
    <InputGroup {...props}>
      <Input />
      <InputAddon>
        <Button variant="quiet">
          <ChevronDownIcon />
        </Button>
      </InputAddon>
    </InputGroup>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxContentProps<T extends object> extends ListBoxProps<T> {
  placement?: PopoverProps["placement"];
  virtulized?: boolean;
}

const ComboboxContent = <T extends object>({
  virtulized,
  placement,
  ...props
}: ComboboxContentProps<T>) => {
  if (virtulized) {
    return (
      <Popover placement={placement} className="w-auto overflow-hidden p-0">
        <ListBoxVirtualizer>
          <ListBox {...props} className="h-80 w-48 overflow-y-auto p-0" />
        </ListBoxVirtualizer>
      </Popover>
    );
  }

  return (
    <Popover placement={placement}>
      <ListBox {...props} />
    </Popover>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ListBoxItem as ComboboxItem,
  ListBoxSection as ComboboxSection,
  ListBoxSectionHeader as ComboboxSectionHeader,
};

export type { ComboboxProps, ComboboxInputProps, ComboboxContentProps };
