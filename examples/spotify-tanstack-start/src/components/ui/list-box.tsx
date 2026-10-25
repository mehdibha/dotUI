"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ListBoxPrimitives from "react-aria-components/ListBox";
import type * as TextPrimitives from "react-aria-components/Text";
import * as VirtualizerPrimitives from "react-aria-components/Virtualizer";

import { CheckIcon } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { tv } from "tailwind-variants";

const listBoxVariants = tv({
  slots: {
    root: "max-h-[inherit] scroll-my-1 overflow-y-auto rounded-[inherit] outline-hidden layout-stack:orientation-horizontal:flex layout-stack:orientation-horizontal:flex-row layout-grid:grid layout-grid:gap-1 layout-grid:orientation-vertical:grid-cols-2 layout-grid:orientation-horizontal:grid-flow-col layout-grid:orientation-horizontal:grid-rows-2 **:data-separator:my-1 **:data-separator:w-auto in-data-trigger:min-w-[calc(max(var(--trigger-width,0px),--spacing(32))-2*1px)] in-data-trigger:max-w-[calc(100vw-2rem)] text-base p-1 **:data-separator:-mx-1",
    item: "group/list-item relative flex w-full cursor-interactive items-center outline-hidden select-ui in-data-trigger:whitespace-nowrap disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0 disabled:text-(--disabled-fg,currentColor) disabled:**:text-current data-[variant=danger]:text-fg-danger has-[[slot=description]]:flex-col has-[[slot=description]]:items-start has-[[slot=description]]:gap-0 has-[[slot=description]]:has-[>svg]:pl-8 has-[[slot=description]]:*:[svg]:absolute has-[[slot=description]]:*:[svg]:top-2 has-[[slot=description]]:*:[svg]:left-2 has-submenu:pr-8 *:[kbd]:ml-auto *:[kbd]:border-0 *:[kbd]:bg-transparent *:[kbd]:text-fg-muted gap-3 py-2 text-base **:[svg]:not-with-[size]:size-5 data-selection-mode:pr-8 focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-highlight focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-highlight focus-visible:bg-highlight focus-visible:text-fg-on-highlight hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-highlight hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-on-highlight data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-danger-muted data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-danger data-[variant=danger]:focus-visible:bg-danger-muted data-[variant=danger]:focus-visible:text-fg-danger data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-danger-muted data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-danger rounded-xs px-3",
    indicator:
      "pointer-events-none group-has-[[slot=description]]/list-item:absolute group-has-[[slot=description]]/list-item:top-2 absolute right-2 flex items-center justify-center",
    itemLabel:
      "in-data-trigger:max-w-full in-data-trigger:min-w-0 in-data-trigger:overflow-x-clip in-data-trigger:text-ellipsis",
    itemDescription: "whitespace-normal text-fg-muted",
    loadMore: "flex w-full items-center justify-center py-1 text-fg-muted",
    section: "scroll-my-1",
    sectionTitle: "font-medium text-fg-muted py-2 px-3 text-xs",
  },
});

const {
  root,
  loadMore,
  item,
  indicator,
  itemLabel,
  itemDescription,
  section,
  sectionTitle,
} = listBoxVariants();

interface ListBoxProps<T> extends ListBoxPrimitives.ListBoxProps<T> {
  isLoading?: ListBoxPrimitives.ListBoxLoadMoreItemProps["isLoading"];
  onLoadMore?: ListBoxPrimitives.ListBoxLoadMoreItemProps["onLoadMore"];
}
const ListBox = <T extends object>({
  className,
  isLoading,
  onLoadMore,
  items,
  children,
  ...props
}: ListBoxProps<T>) => {
  return (
    <ListBoxPrimitives.ListBox
      data-listbox=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      <ListBoxPrimitives.Collection items={items}>
        {children}
      </ListBoxPrimitives.Collection>
      {onLoadMore && (
        <ListBoxPrimitives.ListBoxLoadMoreItem
          className={loadMore()}
          isLoading={isLoading}
          onLoadMore={onLoadMore}
        >
          <Loader />
        </ListBoxPrimitives.ListBoxLoadMoreItem>
      )}
    </ListBoxPrimitives.ListBox>
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxItemProps<T> extends ListBoxPrimitives.ListBoxItemProps<T> {
  variant?: "default" | "danger";
}
const ListBoxItem = <T extends object>({
  className,
  variant,
  textValue: textValueProp,
  ...props
}: ListBoxItemProps<T>) => {
  const textValue =
    textValueProp ||
    (typeof props.children === "string" ? props.children : undefined);

  return (
    <ListBoxPrimitives.ListBoxItem
      data-listbox-item=""
      data-variant={variant}
      textValue={textValue}
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected }) => (
          <>
            {selectionMode !== "none" && (
              <span data-listbox-item-indicator="" className={indicator()}>
                {isSelected && <CheckIcon aria-hidden />}
              </span>
            )}
            {typeof children === "string" ? (
              <ListBoxItemLabel>{children}</ListBoxItemLabel>
            ) : (
              children
            )}
          </>
        ),
      )}
    </ListBoxPrimitives.ListBoxItem>
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxItemLabelProps extends React.ComponentProps<
  typeof TextPrimitives.Text
> {}
const ListBoxItemLabel = ({ className, ...props }: ListBoxItemLabelProps) => {
  return (
    <ListBoxPrimitives.Text
      data-listbox-item-label=""
      slot="label"
      className={itemLabel({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxItemDescriptionProps extends React.ComponentProps<
  typeof TextPrimitives.Text
> {}
const ListBoxItemDescription = ({
  className,
  ...props
}: ListBoxItemDescriptionProps) => {
  return (
    <ListBoxPrimitives.Text
      data-listbox-item-description=""
      slot="description"
      className={itemDescription({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxSectionProps<
  T,
> extends ListBoxPrimitives.ListBoxSectionProps<T> {}
const ListBoxSection = <T extends object>({
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  return (
    <ListBoxPrimitives.ListBoxSection
      data-listbox-section=""
      className={section({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxSectionHeaderProps extends React.ComponentProps<
  typeof ListBoxPrimitives.Header
> {}
const ListBoxSectionHeader = ({
  className,
  ...props
}: ListBoxSectionHeaderProps) => {
  return (
    <ListBoxPrimitives.Header
      data-listbox-section-header=""
      className={sectionTitle({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxVirtualizerProps<T> extends Omit<
  VirtualizerPrimitives.VirtualizerProps<T>,
  "layout"
> {}
const ListBoxVirtualizer = <T extends object>({
  ...props
}: ListBoxVirtualizerProps<T>) => {
  return (
    <VirtualizerPrimitives.Virtualizer
      layout={VirtualizerPrimitives.ListLayout}
      layoutOptions={{
        rowHeight: 32,
        padding: 4,
        gap: 0,
      }}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type {
  ListBoxItemDescriptionProps,
  ListBoxItemLabelProps,
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionHeaderProps,
  ListBoxSectionProps,
  ListBoxVirtualizerProps,
};
export {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
};
