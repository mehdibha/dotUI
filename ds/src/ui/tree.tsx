'use client'

import { ChevronRightIcon, GripVerticalIcon } from 'lucide-react'
import * as ButtonPrimitive from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as TreePrimitive from 'react-aria-components/Tree'
import { tv } from 'tailwind-variants'

import { Checkbox } from '@/ui/checkbox'
const treeVariants = tv({
  slots: {
    root: [
      'flex max-h-[inherit] flex-col gap-px overflow-auto rounded-lg border bg-bg p-1 outline-hidden',
      '[--tree-indent:--spacing(4)]',
      'data-empty:items-center data-empty:justify-center',
      'text-sm',
    ],
    item: [
      'group/tree-item relative flex w-full items-center rounded-(--tree-item-radius) outline-hidden select-none',
      '**:[svg]:pointer-events-none **:[svg]:shrink-0',
      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus',
      'selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover',
      'drop-target:bg-accent-muted drop-target:text-fg',
      'dragging:opacity-60',
      'disabled:pointer-events-none disabled:text-fg-disabled disabled:**:text-current',
      'min-h-8 px-2 py-1 text-sm **:[svg]:not-with-[size]:size-4',
    ],
    itemContent: [
      'flex min-w-0 flex-1 items-center gap-1.5',
      '[padding-inline-start:calc((var(--tree-item-level)_-_1)_*_var(--tree-indent))]',
    ],
    chevron:
      'flex size-4 shrink-0 cursor-interactive items-center justify-center text-fg-muted outline-hidden',
    chevronPlaceholder: 'size-4 shrink-0',
    label: 'flex min-w-0 flex-1 items-center gap-1.5',
  },
  variants: {
    interactive: {
      true: {
        item: 'cursor-interactive hover:bg-muted',
      },
      false: {},
    },
  },
  defaultVariants: {
    interactive: false,
  },
})

interface TreeProps<T> extends TreePrimitive.TreeProps<T> {}

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
  const { root } = treeVariants()
  return (
    <TreePrimitive.Tree
      data-tree=""
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  )
}

interface TreeItemProps<T> extends TreePrimitive.TreeItemProps<T> {}

const TreeItem = <T extends object>({
  className,
  ...props
}: TreeItemProps<T>) => {
  const { item } = treeVariants()
  return (
    <TreePrimitive.TreeItem
      data-tree-item=""
      className={composeRenderProps(className, (cn, renderProps) =>
        item({
          className: cn,
          interactive:
            !renderProps.isDisabled &&
            (renderProps.selectionMode !== 'none' || renderProps.hasChildItems),
        }),
      )}
      {...props}
    />
  )
}

interface TreeItemContentProps extends TreePrimitive.TreeItemContentProps {}

const TreeItemContent = ({ children, ...props }: TreeItemContentProps) => {
  const { itemContent, chevron, chevronPlaceholder, label } = treeVariants()
  return (
    <TreePrimitive.TreeItemContent {...props}>
      {(renderProps) => {
        const hasSelectionCheckbox =
          renderProps.selectionBehavior === 'toggle' &&
          renderProps.selectionMode !== 'none'
        // With no selection checkbox, pressing the row toggles the item's
        // expansion — a parent opens on click, not only via the chevron.
        const toggleExpandOnPress =
          renderProps.hasChildItems && !hasSelectionCheckbox
            ? () => renderProps.state.toggleKey(renderProps.id)
            : undefined
        return (
          <div data-tree-item-content="" className={itemContent()}>
            {renderProps.allowsDragging && (
              <ButtonPrimitive.Button slot="drag" className={chevron()}>
                <GripVerticalIcon aria-hidden />
              </ButtonPrimitive.Button>
            )}
            {hasSelectionCheckbox && <Checkbox slot="selection" />}
            {renderProps.hasChildItems ? (
              <ButtonPrimitive.Button slot="chevron" className={chevron()}>
                <ChevronRightIcon
                  aria-hidden
                  className="transition-transform duration-200 group-data-[expanded]/tree-item:rotate-90"
                />
              </ButtonPrimitive.Button>
            ) : (
              <span aria-hidden="true" className={chevronPlaceholder()} />
            )}
            <span className={label()} onClick={toggleExpandOnPress}>
              {typeof children === 'function'
                ? children(renderProps)
                : children}
            </span>
          </div>
        )
      }}
    </TreePrimitive.TreeItemContent>
  )
}

export type { TreeItemContentProps, TreeItemProps, TreeProps }
export { Tree, TreeItem, TreeItemContent }
