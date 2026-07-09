'use client'

import { use } from 'react'
import type React from 'react'
import { CheckIcon } from 'lucide-react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as ListBoxPrimitive from 'react-aria-components/ListBox'
import type * as TextPrimitive from 'react-aria-components/Text'
import * as VirtualizerPrimitive from 'react-aria-components/Virtualizer'
import { type VariantProps, tv } from 'tailwind-variants'

import { Loader } from '@/ui/loader'
const listBoxVariants = tv({
  slots: {
    root: [
      'max-h-[inherit] scroll-my-1 overflow-y-auto p-1 outline-hidden',
      'layout-stack:orientation-horizontal:flex layout-stack:orientation-horizontal:flex-row',
      'layout-grid:grid layout-grid:gap-1',
      'layout-grid:orientation-vertical:grid-cols-2',
      'layout-grid:orientation-horizontal:grid-flow-col layout-grid:orientation-horizontal:grid-rows-2',
      '**:data-separator:-mx-1 **:data-separator:my-1 **:data-separator:w-auto',
      'text-sm',
    ],
    item: [
      'relative flex w-full cursor-interactive items-center gap-2 rounded-(--list-box-item-radius) outline-hidden select-none disabled:pointer-events-none **:[svg]:pointer-events-none **:[svg]:shrink-0',
      'data-selection-mode:pr-8',
      'hover:not-in-data-[trigger=ComboBox]:not-in-data-[trigger=Select]:bg-highlight hover:not-in-data-[trigger=ComboBox]:not-in-data-[trigger=Select]:text-fg-on-highlight',
      'focus:in-[:is([data-trigger=ComboBox],[data-trigger=Select])]:bg-highlight focus:in-[:is([data-trigger=ComboBox],[data-trigger=Select])]:text-fg-on-highlight',
      'focus-visible:bg-highlight',
      'disabled:text-fg-disabled disabled:**:text-current',
      'has-data-listbox-item-description:flex-col has-data-listbox-item-description:items-start has-data-listbox-item-description:gap-0 has-data-listbox-item-description:has-[>svg]:pl-8 has-data-listbox-item-description:**:data-listbox-item-indicator:top-2 has-data-listbox-item-description:*:[svg]:absolute has-data-listbox-item-description:*:[svg]:top-2 has-data-listbox-item-description:*:[svg]:left-2',
      '*:[kbd]:ml-auto *:[kbd]:bg-transparent *:[kbd]:text-fg-muted',
      'gap-1.5 px-1.5 py-1 text-sm **:[svg]:not-with-[size]:size-4',
      'overflow-hidden focus-visible:before:absolute focus-visible:before:inset-y-0 focus-visible:before:left-0 focus-visible:before:w-0.5 focus-visible:before:rounded-[inherit] focus-visible:before:bg-accent',
    ],
    indicator:
      'pointer-events-none absolute right-2 flex items-center justify-center',
    itemLabel: '',
    itemDescription: 'text-fg-muted',
    loadMore: 'flex w-full items-center justify-center py-1 text-fg-muted',
    section: 'scroll-my-1',
    sectionTitle: ['px-2 py-1.5 text-xs text-fg-muted', 'px-1.5 py-1'],
  },
  variants: {
    variant: {
      default: {},
      danger: {},
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface ListBoxProps<T> extends ListBoxPrimitive.ListBoxProps<T> {
  isLoading?: ListBoxPrimitive.ListBoxLoadMoreItemProps['isLoading']
  onLoadMore?: ListBoxPrimitive.ListBoxLoadMoreItemProps['onLoadMore']
}
const ListBox = <T extends object>({
  className,
  isLoading,
  onLoadMore,
  items,
  children,
  ...props
}: ListBoxProps<T>) => {
  const { root, loadMore } = listBoxVariants()
  const standalone = !use(ListBoxPrimitive.ListBoxContext)

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
  )
}

interface ListBoxItemProps<T>
  extends
    ListBoxPrimitive.ListBoxItemProps<T>,
    VariantProps<typeof listBoxVariants> {}
const ListBoxItem = <T extends object>({
  className,
  variant,
  textValue: textValueProp,
  ...props
}: ListBoxItemProps<T>) => {
  const { item, indicator } = listBoxVariants()
  const textValue =
    textValueProp ||
    (typeof props.children === 'string' ? props.children : undefined)

  return (
    <ListBoxPrimitive.ListBoxItem
      data-listbox-item=""
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
            {typeof children === 'string' ? (
              <ListBoxItemLabel>{children}</ListBoxItemLabel>
            ) : (
              children
            )}
            {selectionMode !== 'none' && (
              <span data-listbox-item-indicator="" className={indicator()}>
                {isSelected && <CheckIcon />}
              </span>
            )}
          </>
        ),
      )}
    </ListBoxPrimitive.ListBoxItem>
  )
}

interface ListBoxItemLabelProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const ListBoxItemLabel = ({ className, ...props }: ListBoxItemLabelProps) => {
  const { itemLabel } = listBoxVariants()
  return (
    <ListBoxPrimitive.Text
      data-listbox-item-label=""
      className={itemLabel({ className })}
      {...props}
    />
  )
}

interface ListBoxItemDescriptionProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}
const ListBoxItemDescription = ({
  className,
  ...props
}: ListBoxItemDescriptionProps) => {
  const { itemDescription } = listBoxVariants()
  return (
    <ListBoxPrimitive.Text
      data-listbox-item-description=""
      className={itemDescription({ className })}
      {...props}
    />
  )
}

interface ListBoxSectionProps<
  T,
> extends ListBoxPrimitive.ListBoxSectionProps<T> {}
const ListBoxSection = <T extends object>({
  className,
  ...props
}: ListBoxSectionProps<T>) => {
  const { section } = listBoxVariants()
  return (
    <ListBoxPrimitive.ListBoxSection
      data-listbox-section=""
      className={section({ className })}
      {...props}
    />
  )
}

interface ListBoxSectionHeaderProps extends React.ComponentProps<
  typeof ListBoxPrimitive.Header
> {}
const ListBoxSectionHeader = ({
  className,
  ...props
}: ListBoxSectionHeaderProps) => {
  const { sectionTitle } = listBoxVariants()
  return (
    <ListBoxPrimitive.Header
      data-listbox-section-header=""
      className={sectionTitle({ className })}
      {...props}
    />
  )
}

interface ListBoxVirtualizerProps<T> extends Omit<
  VirtualizerPrimitive.VirtualizerProps<T>,
  'layout'
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
