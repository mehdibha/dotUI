"use client"

import type React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as GridListPrimitive from "react-aria-components/GridList"
import type { VariantProps } from "tailwind-variants"

import { CheckIcon, ChevronRightIcon } from "@/registry/icons"

import { useStyles } from "./styles"
import type { ListStyles } from "./styles"

interface ListProps<T> extends GridListPrimitive.GridListProps<T> {}

const List = <T extends object>({ className, ...props }: ListProps<T>) => {
  const { root } = useStyles()()
  return (
    <GridListPrimitive.GridList
      data-list=""
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  )
}

// MARK: Separator

interface ListItemProps<T>
  extends GridListPrimitive.GridListItemProps<T>, VariantProps<ListStyles> {
  hasChevron?: boolean
}

const ListItem = <T extends object>({
  className,
  variant,
  hasChevron,
  textValue: textValueProp,
  ...props
}: ListItemProps<T>) => {
  const { item, itemAccessory, chevron, check } = useStyles()()
  const textValue =
    textValueProp ??
    (typeof props.children === "string" ? props.children : undefined)
  const showChevron = hasChevron ?? props.href !== undefined

  return (
    <GridListPrimitive.GridListItem
      data-list-item=""
      textValue={textValue}
      className={composeRenderProps(className, (cn) =>
        item({ className: cn, variant }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected }) => (
          <>
            {typeof children === "string" ? (
              <ListItemLabel>{children}</ListItemLabel>
            ) : (
              children
            )}
            {(showChevron || (selectionMode !== "none" && isSelected)) && (
              <span data-slot="list-item-accessory" className={itemAccessory()}>
                {selectionMode !== "none" && isSelected ? (
                  <CheckIcon className={check()} />
                ) : (
                  <ChevronRightIcon className={chevron()} />
                )}
              </span>
            )}
          </>
        ),
      )}
    </GridListPrimitive.GridListItem>
  )
}

// MARK: Separator

interface ListItemIconProps extends React.ComponentProps<"span"> {}

const ListItemIcon = ({ className, ...props }: ListItemIconProps) => {
  const { itemIcon } = useStyles()()
  return (
    <span
      data-slot="list-item-icon"
      className={itemIcon({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListItemLabelProps extends React.ComponentProps<"span"> {}

const ListItemLabel = ({ className, ...props }: ListItemLabelProps) => {
  const { itemLabel } = useStyles()()
  return (
    <span
      data-slot="list-item-label"
      className={itemLabel({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListItemDescriptionProps extends React.ComponentProps<"span"> {}

const ListItemDescription = ({
  className,
  ...props
}: ListItemDescriptionProps) => {
  const { itemDescription } = useStyles()()
  return (
    <span
      data-slot="list-item-description"
      className={itemDescription({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListItemValueProps extends React.ComponentProps<"span"> {}

const ListItemValue = ({ className, ...props }: ListItemValueProps) => {
  const { itemValue } = useStyles()()
  return (
    <span
      data-slot="list-item-value"
      className={itemValue({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListSectionProps<
  T,
> extends GridListPrimitive.GridListSectionProps<T> {}

const ListSection = <T extends object>({
  className,
  ...props
}: ListSectionProps<T>) => {
  const { section } = useStyles()()
  return (
    <GridListPrimitive.GridListSection
      data-list-section=""
      className={section({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface ListSectionHeaderProps extends React.ComponentProps<
  typeof GridListPrimitive.GridListHeader
> {}

const ListSectionHeader = ({ className, ...props }: ListSectionHeaderProps) => {
  const { sectionHeader } = useStyles()()
  return (
    <GridListPrimitive.GridListHeader
      data-slot="list-section-header"
      className={sectionHeader({ className })}
      {...props}
    />
  )
}

export type {
  ListItemDescriptionProps,
  ListItemIconProps,
  ListItemLabelProps,
  ListItemProps,
  ListItemValueProps,
  ListProps,
  ListSectionHeaderProps,
  ListSectionProps,
}
export {
  List,
  ListItem,
  ListItemDescription,
  ListItemIcon,
  ListItemLabel,
  ListItemValue,
  ListSection,
  ListSectionHeader,
}
