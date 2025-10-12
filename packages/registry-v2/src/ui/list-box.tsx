"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import {
  Collection as AriaCollection,
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxLoadMoreItem as AriaListBoxLoadMoreItem,
  ListBoxSection as AriaListBoxSection,
  composeRenderProps,
  ListStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { focusRing } from "@dotui/registry-v2/lib/focus-styles";
import { Loader } from "@dotui/registry-v2/ui/loader";
import { Text } from "@dotui/registry-v2/ui/text";

const listBoxStyles = tv({
  base: [
    focusRing(),
    "flex flex-col overflow-auto p-1 outline-hidden empty:min-h-24 empty:items-center empty:justify-center empty:text-sm empty:text-fg-muted empty:italic layout-grid:grid layout-grid:w-auto layout-grid:grid-cols-2 orientation-horizontal:w-auto orientation-horizontal:flex-row",
    "[&_.separator]:-mx-1 [&_.separator]:my-1 [&_.separator]:w-auto",
  ],
  variants: {
    standalone: {
      true: "max-h-60 w-48 overflow-y-auto rounded-md border bg-bg",
      false: "max-h-[inherit] rounded-[inherit]",
    },
  },
});

const listBoxItemStyles = tv({
  base: [
    "flex cursor-pointer items-center gap-2 rounded-sm px-3 py-1.5 text-sm outline-hidden transition-colors focus:bg-inverse/10 disabled:pointer-events-none disabled:**:text-fg-disabled",
    "selection-single:pl-0 selection-multiple:pl-0",
    "group-data-[type=drawer]/overlay:py-3 group-data-[type=drawer]/overlay:text-lg",
    "group-data-[type=modal]/overlay:py-2 group-data-[type=modal]/overlay:text-base",
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
  slots: {
    listboxSection: "",
    listboxHeading: "text-xs pl-3 my-1",
  },
});

const { listboxSection, listboxHeading } = listboxSectionStyles();

interface ListBoxProps<T> extends AriaListBoxProps<T> {
  isLoading?: boolean;
  onLoadMore?: () => void;
}
const ListBox = <T extends object>({
  children,
  isLoading,
  onLoadMore,
  renderEmptyState = () => "No results found.",
  ...props
}: ListBoxProps<T>) => {
  const state = React.useContext(ListStateContext);
  const standalone = !state;
  return (
    <AriaListBox
      {...props}
      data-slot="list-box"
      renderEmptyState={renderEmptyState}
      className={composeRenderProps(props.className, (className) =>
        listBoxStyles({ standalone, className }),
      )}
    >
      <AriaCollection items={props.items}>{children}</AriaCollection>
      <AriaListBoxLoadMoreItem isLoading={isLoading} onLoadMore={onLoadMore}>
        <Loader />
      </AriaListBoxLoadMoreItem>
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
    label ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem
      {...props}
      data-slot="list-box-item"
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
                  <CheckIcon aria-hidden className="size-4 text-fg-accent" />
                )}
              </span>
            )}
            <span className="flex flex-1 items-center gap-3">
              {prefix}
              <span className="flex flex-1 flex-col">
                {children}
                {label && <Text slot="label">{label}</Text>}
                {description && <Text slot="description">{description}</Text>}
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
    <AriaListBoxSection className={listboxSection({ className })} {...props}>
      <AriaCollection items={props.items}>{children}</AriaCollection>
    </AriaListBoxSection>
  );
};

const ListBoxSectionTitle = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AriaHeader>) => {
  return (
    <AriaHeader className={listboxHeading({ className })} {...props}>
      {children}
    </AriaHeader>
  );
};

export type { ListBoxProps, ListBoxItemProps, ListBoxSectionProps };
export { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionTitle };
