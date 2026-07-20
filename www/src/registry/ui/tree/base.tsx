'use client'

import * as ButtonPrimitive from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as TreePrimitive from 'react-aria-components/Tree'

import { ChevronRightIcon, GripVerticalIcon } from '@/registry/icons'
import { Checkbox } from '@/registry/ui/checkbox'

import { useStyles } from './styles'

// MARK: Separator

interface TreeProps<T> extends TreePrimitive.TreeProps<T> {}

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
  const { root } = useStyles()()
  return (
    <TreePrimitive.Tree
      data-tree=""
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  )
}

// MARK: Separator

interface TreeItemProps<T> extends TreePrimitive.TreeItemProps<T> {}

const TreeItem = <T extends object>({
  className,
  ...props
}: TreeItemProps<T>) => {
  const { item } = useStyles()()
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

// MARK: Separator

interface TreeItemContentProps extends TreePrimitive.TreeItemContentProps {}

const TreeItemContent = ({ children, ...props }: TreeItemContentProps) => {
  const { itemContent, chevron, chevronPlaceholder, label } = useStyles()()
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

// MARK: Separator

export type { TreeItemContentProps, TreeItemProps, TreeProps }
export { Tree, TreeItem, TreeItemContent }
