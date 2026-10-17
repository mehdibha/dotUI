"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as ListBoxPrimitives from "react-aria-components/ListBox"
import type * as TextPrimitive from "react-aria-components/Text"
import * as VirtualizerPrimitives from "react-aria-components/Virtualizer"

import { CheckIcon } from "@/registry/icons"
import { Loader } from "@/registry/ui/loader"

import { useStyles } from "./styles"

interface ListBoxProps<T> extends ListBoxPrimitives.ListBoxProps<T> {
  isLoading?: ListBoxPrimitives.ListBoxLoadMoreItemProps["isLoading"]
  onLoadMore?: ListBoxPrimitives.ListBoxLoadMoreItemProps["onLoadMore"]
}
const ListBox = <T extends object>({
  className,
  isLoading,
  onLoadMore,
  items,
  children,
  ...props
}: ListBoxProps<T>) => {
  const { root, loadMore } = useStyles()()
  const standalone = !React.use(ListBoxPrimitives.ListBoxContext)

  return (
    <ListBoxPrimitives.ListBox
      data-listbox=""
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      data-standalone={standalone ?? undefined}
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
  )
}

// MARK: Separator

interface ListBoxItemProps<T> extends ListBoxPrimitives.ListBoxItemProps<T> {
  variant?: "default" | "danger"
}
const ListBoxItem = <T extends object>({
  className,
  variant,
  textValue: textValueProp,
  ...props
}: ListBoxItemProps<T>) => {
  const { item, indicator } = useStyles()()
  const textValue =
    textValueProp ||
    (typeof props.children === "string" ? props.children : undefined)

  return (
    <ListBoxPrimitives.ListBoxItem
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
    </ListBoxPrimitives.ListBoxItem>
  )
}

// MARK: Separator

interface ListBoxItemLabelProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const ListBoxItemLabel = ({ className, ...props }: ListBoxItemLabelProps) => {
  const { itemLabel } = useStyles()()
  return (
    <ListBoxPrimitives.Text
      data-listbox-item-label=""
      slot="label"
      className={itemLabel({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListBoxItemDescriptionProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const ListBoxItemDescription = ({
  className,
  ...props
}: ListBoxItemDescriptionProps) => {
  const { itemDescription } = useStyles()()
  return (
    <ListBoxPrimitives.Text
      data-listbox-item-description=""
      slot="description"
      className={itemDescription({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListBoxSectionProps<
  T,
> extends ListBoxPrimitives.ListBoxSectionProps<T> {}
const ListBoxSection = <T extends object>({
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  const { section } = useStyles()()
  return (
    <ListBoxPrimitives.ListBoxSection
      data-listbox-section=""
      className={section({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListBoxSectionHeaderProps extends React.ComponentProps<
  typeof ListBoxPrimitives.Header
> {}
const ListBoxSectionHeader = ({
  className,
  ...props
}: ListBoxSectionHeaderProps) => {
  const { sectionTitle } = useStyles()()
  return (
    <ListBoxPrimitives.Header
      data-listbox-section-header=""
      className={sectionTitle({ className })}
      {...props}
    />
  )
}

// MARK: Separator

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
  )
}

export type {
  ListBoxItemDescriptionProps,
  ListBoxItemLabelProps,
  ListBoxItemProps,
  ListBoxProps,
  ListBoxSectionHeaderProps,
  ListBoxSectionProps,
  ListBoxVirtualizerProps,
}
export {
  ListBox,
  ListBoxItem,
  ListBoxItemDescription,
  ListBoxItemLabel,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
}
