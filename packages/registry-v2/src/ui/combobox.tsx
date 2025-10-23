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

import { Button } from "@dotui/registry-v2/ui/button";
import { fieldStyles } from "@dotui/registry-v2/ui/field";
import { Input, InputAddon, InputGroup } from "@dotui/registry-v2/ui/input";
import { ListBox } from "@dotui/registry-v2/ui/list-box";
import { Popover } from "@dotui/registry-v2/ui/popover";
import type { InputGroupProps } from "@dotui/registry-v2/ui/input";
import type { ListBoxProps } from "@dotui/registry-v2/ui/list-box";
import type { PopoverProps } from "@dotui/registry-v2/ui/popover";

import { cn } from "../lib/utils";

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
        className: cn(
          className,
          // temporary fix for react-aria-components, data-focused is missing in input when menuTrigger = 'focus' and a selected item is present
          // 'focus:[&_[data-slot="input"]:not([data-in-group])]:focus-input focus:[&_[data-slot="input-group"]]:focus-input',
        ),
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

const ComboboxInput = (props: InputGroupProps) => {
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

const ComboboxContent = <T extends object>({
  placement,
  ...props
}: ListBoxProps<T> & { placement?: PopoverProps["placement"] }) => {
  return (
    <Popover placement={placement}>
      <ListBox {...props} />
    </Popover>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Combobox, ComboboxInput, ComboboxContent };

export type { ComboboxProps };
