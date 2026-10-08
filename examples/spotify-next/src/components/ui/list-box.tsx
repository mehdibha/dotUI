"use client";

import { use } from "react";
import type React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ListBoxPrimitive from "react-aria-components/ListBox";
import type * as TextPrimitive from "react-aria-components/Text";
import * as VirtualizerPrimitive from "react-aria-components/Virtualizer";

import { CheckIcon } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import { tv } from "tailwind-variants";

const listBoxVariants = tv({
  slots: {
    root: "max-h-[inherit] scroll-my-1 overflow-y-auto rounded-[inherit] outline-hidden layout-stack:orientation-horizontal:flex layout-stack:orientation-horizontal:flex-row layout-grid:grid layout-grid:gap-1 layout-grid:orientation-vertical:grid-cols-2 layout-grid:orientation-horizontal:grid-flow-col layout-grid:orientation-horizontal:grid-rows-2 **:data-separator:my-1 **:data-separator:w-auto in-data-trigger:min-w-[calc(max(var(--trigger-width,0px),--spacing(32))-2*1px)] in-data-trigger:max-w-[calc(100vw-2rem)] text-base p-1 **:data-separator:-mx-1",
    item: "group/list-item relative flex w-full cursor-interactive items-center outline-hidden select-ui in-data-trigger:whitespace-nowrap disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0 disabled:text-(--disabled-fg,currentColor) disabled:**:text-current data-[variant=danger]:text-fg-danger has-[[slot=description]]:flex-col has-[[slot=description]]:items-start has-[[slot=description]]:gap-0 has-[[slot=description]]:has-[>svg]:pl-8 has-[[slot=description]]:*:[svg]:absolute has-[[slot=description]]:*:[svg]:top-2 has-[[slot=description]]:*:[svg]:left-2 has-submenu:pr-8 *:[kbd]:ml-auto *:[kbd]:border-0 *:[kbd]:bg-transparent *:[kbd]:text-fg-muted gap-3 py-2 text-base **:[svg]:not-with-[size]:size-5 data-selection-mode:pr-8 focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-highlight focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-highlight focus-visible:bg-highlight focus-visible:text-fg-on-highlight hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-highlight hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-on-highlight data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:bg-danger-muted data-[variant=danger]:focus:in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select])]:text-fg-danger data-[variant=danger]:focus-visible:bg-danger-muted data-[variant=danger]:focus-visible:text-fg-danger data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:bg-danger-muted data-[variant=danger]:hover:not-in-[:is([role=menu],[data-trigger=ComboBox],[data-trigger=Select],[role=listbox]:has([data-focus-visible]))]:text-fg-danger rounded-md px-3",
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

interface ListBoxProps<T> extends ListBoxPrimitive.ListBoxProps<T> {
  isLoading?: ListBoxPrimitive.ListBoxLoadMoreItemProps["isLoading"];
  onLoadMore?: ListBoxPrimitive.ListBoxLoadMoreItemProps["onLoadMore"];
}
const ListBox = <T extends object>({
  className,
  isLoading,
  onLoadMore,
  items,
  children,
  ...props
}: ListBoxProps<T>) => {
  const standalone = !use(ListBoxPrimitive.ListBoxContext);

  return (
    <ListBoxPrimitive.ListBox
      data-listbox=""
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      data-standalone={standalone ?? undefined}
      {...props}
    >
      <ListBoxPrimitive.Collection items={items}>
        {children}
      </ListBoxPrimitive.Collection>
      {onLoadMore && (
        <ListBoxPrimitive.ListBoxLoadMoreItem
          className={loadMore()}
          isLoading={isLoading}
          onLoadMore={onLoadMore}
        >
          <Loader />
        </ListBoxPrimitive.ListBoxLoadMoreItem>
      )}
    </ListBoxPrimitive.ListBox>
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxItemProps<T> extends ListBoxPrimitive.ListBoxItemProps<T> {
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
    <ListBoxPrimitive.ListBoxItem
      data-listbox-item=""
      data-variant={variant}
      textValue={textValue}
      className={composeRenderProps(className, (cn) => item({ className: cn }))}
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
    </ListBoxPrimitive.ListBoxItem>
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxItemLabelProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const ListBoxItemLabel = ({ className, ...props }: ListBoxItemLabelProps) => {
  return (
    <ListBoxPrimitive.Text
      data-listbox-item-label=""
      slot="label"
      className={itemLabel({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxItemDescriptionProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const ListBoxItemDescription = ({
  className,
  ...props
}: ListBoxItemDescriptionProps) => {
  return (
    <ListBoxPrimitive.Text
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
> extends ListBoxPrimitive.ListBoxSectionProps<T> {}
const ListBoxSection = <T extends object>({
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  return (
    <ListBoxPrimitive.ListBoxSection
      data-listbox-section=""
      className={section({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxSectionHeaderProps extends React.ComponentProps<
  typeof ListBoxPrimitive.Header
> {}
const ListBoxSectionHeader = ({
  className,
  ...props
}: ListBoxSectionHeaderProps) => {
  return (
    <ListBoxPrimitive.Header
      data-listbox-section-header=""
      className={sectionTitle({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface ListBoxVirtualizerProps<T> extends Omit<
  VirtualizerPrimitive.VirtualizerProps<T>,
  "layout"
> {}
const ListBoxVirtualizer = <T extends object>({
  ...props
}: ListBoxVirtualizerProps<T>) => {
  return (
    <VirtualizerPrimitive.Virtualizer
      layout={VirtualizerPrimitive.ListLayout}
      layoutOptions={{
        rowHeight: 32,
        padding: 4,
        gap: 0,
      }}
      {...props}
    />
  );
};

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
