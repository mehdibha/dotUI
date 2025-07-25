"use client";

import type {
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import React from "react";
import { focusRing } from "@/registry/lib/focus-styles";
import { Loader } from "@/registry/ui/loader.ring";
import { Text } from "@/registry/ui/text.basic";
import { CheckIcon } from "lucide-react";
import {
  Collection as AriaCollection,
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  composeRenderProps,
  ListStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const listBoxStyles = tv({
  base: [
    focusRing(),
    "orientation-horizontal:flex-row orientation-horizontal:w-auto layout-grid:grid layout-grid:grid-cols-2 layout-grid:w-auto empty:text-fg-muted flex flex-col overflow-auto p-1 outline-hidden empty:min-h-24 empty:items-center empty:justify-center empty:text-sm empty:italic",
    "[&_.separator]:-mx-1 [&_.separator]:my-1 [&_.separator]:w-auto",
  ],
  variants: {
    standalone: {
      true: "bg-bg max-h-60 w-48 overflow-y-auto rounded-md border",
      false: "max-h-[inherit] rounded-[inherit]",
    },
  },
});

const listBoxItemStyles = tv({
  base: [
    "disabled:pointer-default hover:bg-bg-inverse/10 focus:bg-bg-inverse/10 pressed:bg-bg-inverse/15 disabled:text-fg-disabled flex h-8 cursor-pointer items-center rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors disabled:cursor-default",
    "selection-single:pl-0 selection-multiple:pl-0",
    "[&_svg]:size-4",
  ],
  variants: {
    variant: {
      default: "text-fg",
      success: "text-fg-success",
      warning: "text-fg-warning",
      accent: "text-fg-accent",
      danger: "text-fg-danger",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const listboxSectionStyles = tv({
  base: "space-y-px pt-2",
});

interface ListBoxProps<T> extends AriaListBoxProps<T> {
  isLoading?: boolean;
}
const ListBox = <T extends object>({
  children,
  isLoading,
  ...props
}: ListBoxProps<T>) => {
  const state = React.useContext(ListStateContext);
  const standalone = !state;
  return (
    <AriaListBox
      {...props}
      className={composeRenderProps(props.className, (className) =>
        listBoxStyles({ standalone, className }),
      )}
    >
      <AriaCollection items={props.items}>{children}</AriaCollection>
      {isLoading && (
        <AriaListBoxItem className="flex items-center justify-center py-1.5">
          <Loader />
        </AriaListBoxItem>
      )}
    </AriaListBox>
  );
};

interface ListBoxItemProps<T>
  extends AriaListBoxItemProps<T>,
    VariantProps<typeof listBoxItemStyles> {
  label?: string;
  description?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}
const ListBoxItem = <T extends object>({
  variant,
  label,
  description,
  prefix,
  suffix,
  ...props
}: ListBoxItemProps<T>) => {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(props.className, (className) =>
        listBoxItemStyles({ variant, className }),
      )}
    >
      {composeRenderProps(
        props.children,
        (children, { isSelected, selectionMode }) => (
          <>
            {selectionMode !== "none" && (
              <span className="flex w-8 shrink-0 items-center justify-center">
                {isSelected && (
                  <CheckIcon aria-hidden className="text-fg-accent size-4" />
                )}
              </span>
            )}
            <span className="flex items-center gap-3">
              {prefix}
              <span className="flex flex-1 flex-col">
                {label && <Text slot="label">{label}</Text>}
                {description && <Text slot="description">{description}</Text>}
                {children}
              </span>
              {suffix}
            </span>
          </>
        ),
      )}
    </AriaListBoxItem>
  );
};

interface ListBoxSectionProps<T> extends AriaListBoxSectionProps<T> {
  ref?: React.Ref<HTMLElement>;
  title?: React.ReactNode;
}
const ListBoxSection = <T extends object>({
  title,
  children,
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  return (
    <AriaListBoxSection
      className={listboxSectionStyles({ className })}
      {...props}
    >
      {title && (
        <AriaHeader className="text-fg-muted mb-1 pl-3 text-xs">
          {title}
        </AriaHeader>
      )}
      <AriaCollection items={props.items}>{children}</AriaCollection>
    </AriaListBoxSection>
  );
};

export type { ListBoxProps, ListBoxItemProps, ListBoxSectionProps };
export { ListBox, ListBoxItem, ListBoxSection };
