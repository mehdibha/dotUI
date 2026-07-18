'use client'

import type React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import * as ButtonPrimitive from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as GridListPrimitive from 'react-aria-components/GridList'
import type * as TextPrimitive from 'react-aria-components/Text'

import { Checkbox } from '@/registry/ui/checkbox'
import { Loader } from '@/registry/ui/loader'

import { useStyles } from './styles'

interface GridListProps<T> extends GridListPrimitive.GridListProps<T> {
  isLoading?: GridListPrimitive.GridListLoadMoreItemProps['isLoading']
  onLoadMore?: GridListPrimitive.GridListLoadMoreItemProps['onLoadMore']
}
const GridList = <T extends object>({
  className,
  isLoading,
  onLoadMore,
  items,
  children,
  ...props
}: GridListProps<T>) => {
  const { root, loadMore } = useStyles()()

  return (
    <GridListPrimitive.GridList
      data-grid-list=""
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    >
      <GridListPrimitive.Collection items={items}>
        {children}
      </GridListPrimitive.Collection>
      {onLoadMore && (
        <GridListPrimitive.GridListLoadMoreItem
          className={loadMore()}
          isLoading={isLoading}
          onLoadMore={onLoadMore}
        >
          <Loader />
        </GridListPrimitive.GridListLoadMoreItem>
      )}
    </GridListPrimitive.GridList>
  )
}

// MARK: Separator

interface GridListItemProps<T> extends GridListPrimitive.GridListItemProps<T> {}
const GridListItem = <T extends object>({
  className,
  textValue: textValueProp,
  ...props
}: GridListItemProps<T>) => {
  const { item, dragHandle } = useStyles()()
  const textValue =
    textValueProp ||
    (typeof props.children === 'string' ? props.children : undefined)

  return (
    <GridListPrimitive.GridListItem
      data-grid-list-item=""
      textValue={textValue}
      className={composeRenderProps(className, (cn) => item({ className: cn }))}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { selectionMode, selectionBehavior, allowsDragging }) => (
          <>
            {allowsDragging && (
              <ButtonPrimitive.Button slot="drag" className={dragHandle()}>
                <GripVerticalIcon aria-hidden />
              </ButtonPrimitive.Button>
            )}
            {selectionMode !== 'none' && selectionBehavior === 'toggle' && (
              <Checkbox slot="selection" />
            )}
            {typeof children === 'string' ? (
              <GridListItemLabel>{children}</GridListItemLabel>
            ) : (
              children
            )}
          </>
        ),
      )}
    </GridListPrimitive.GridListItem>
  )
}

// MARK: Separator

interface GridListItemLabelProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const GridListItemLabel = ({ className, ...props }: GridListItemLabelProps) => {
  const { itemLabel } = useStyles()()
  return (
    <GridListPrimitive.Text
      data-grid-list-item-label=""
      className={itemLabel({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface GridListItemDescriptionProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const GridListItemDescription = ({
  className,
  ...props
}: GridListItemDescriptionProps) => {
  const { itemDescription } = useStyles()()
  return (
    <GridListPrimitive.Text
      data-grid-list-item-description=""
      slot="description"
      className={itemDescription({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface GridListSectionProps<
  T,
> extends GridListPrimitive.GridListSectionProps<T> {}
const GridListSection = <T extends object>({
  className,
  ...props
}: GridListSectionProps<T>) => {
  const { section } = useStyles()()
  return (
    <GridListPrimitive.GridListSection
      data-grid-list-section=""
      className={section({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface GridListSectionHeaderProps extends React.ComponentProps<
  typeof GridListPrimitive.GridListHeader
> {}
const GridListSectionHeader = ({
  className,
  ...props
}: GridListSectionHeaderProps) => {
  const { sectionTitle } = useStyles()()
  return (
    <GridListPrimitive.GridListHeader
      data-grid-list-section-header=""
      className={sectionTitle({ className })}
      {...props}
    />
  )
}

export type {
  GridListItemDescriptionProps,
  GridListItemLabelProps,
  GridListItemProps,
  GridListProps,
  GridListSectionHeaderProps,
  GridListSectionProps,
}
export {
  GridList,
  GridListItem,
  GridListItemDescription,
  GridListItemLabel,
  GridListSection,
  GridListSectionHeader,
}
