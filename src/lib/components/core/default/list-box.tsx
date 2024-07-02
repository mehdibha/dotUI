"use client";

import React from "react";
import {
  composeRenderProps,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Collection as AriaCollection,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxItemProps as AriaListBoxItemProps,
  ListStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { CheckIcon, LoaderIcon } from "@/lib/icons";
import { focusRing } from "@/lib/utils/styles";
import { Text } from "./text";

const listBoxStyles = tv({
  extend: focusRing,
  base: "data-[standalone]:border flex flex-col p-1 overflow-auto outline-none data-[standalone]:bg-bg data-[standalone]:w-48 data-[standalone]:rounded-md orientation-horizontal:flex-row orientation-horizontal:w-auto layout-grid:grid layout-grid:grid-cols-2 layout-grid:w-auto empty:justify-center empty:items-center empty:italic empty:min-h-24 empty:text-fg-muted empty:text-sm",
});

const listBoxItemStyles = tv({
  base: [
    "flex cursor-pointer items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors disabled:pointer-default hover:bg-bg-inverse/10 focus:bg-bg-inverse/10 pressed:bg-bg-inverse/15 disabled:text-fg-disabled disabled:cursor-default",
    "selection-single:pl-0.5 selection-multiple:pl-0.5",
  ],
});

interface ListBoxProps<T> extends AriaListBoxProps<T> {
  isLoading?: boolean;
}
const ListBox = <T extends object>({ children, isLoading, ...props }: ListBoxProps<T>) => {
  const state = React.useContext(ListStateContext);
  const standalone = !state;
  // let document = useContext(CollectionDocumentContext);
  return (
    <AriaListBox
      {...props}
      className={composeRenderProps(props.className, (className) => listBoxStyles({ className }))}
      data-standalone={standalone || undefined}
    >
      <AriaCollection items={props.items}>{children}</AriaCollection>
      {isLoading && (
        <AriaListBoxItem className="flex items-center justify-center py-1.5">
          <LoaderIcon aria-label="Loading more..." className="size-5 animate-spin text-fg-muted" />
        </AriaListBoxItem>
      )}
    </AriaListBox>
  );
};

interface ListBoxItemProps<T> extends AriaListBoxItemProps<T> {
  label?: string;
  description?: string;
}
const ListBoxItem = <T extends object>({ label, description, ...props }: ListBoxItemProps<T>) => {
  const textValue =
    props.textValue || (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaListBoxItem
      {...props}
      textValue={textValue}
      className={composeRenderProps(props.className, (className) =>
        listBoxItemStyles({ className })
      )}
    >
      {composeRenderProps(props.children, (children, { isSelected, selectionMode }) => (
        <>
          {selectionMode !== "none" && (
            <span className="flex w-8 items-center justify-center">
              {isSelected && <CheckIcon aria-hidden className="size-4 text-fg-accent" />}
            </span>
          )}
          <span className="flex flex-col">
            {label && <Text slot="label">{label}</Text>}
            {description && <Text slot="description">{description}</Text>}
            {children}
          </span>
        </>
      ))}
    </AriaListBoxItem>
  );
};

export type { ListBoxProps, ListBoxItemProps };
export { ListBox, ListBoxItem, ListBoxItem as Item };
