'use client'

import { ChevronRightIcon, GripVerticalIcon } from 'lucide-react'
import * as ButtonPrimitive from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as TreePrimitive from 'react-aria-components/Tree'

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
      className={composeRenderProps(className, (cn) => item({ className: cn }))}
      {...props}
    />
  )
}

// MARK: Separator

interface TreeItemContentProps extends TreePrimitive.TreeItemContentProps {}

const TreeItemContent = ({ children, ...props }: TreeItemContentProps) => {
  const { itemContent, chevron, chevronPlaceholder } = useStyles()()
  return (
    <TreePrimitive.TreeItemContent {...props}>
      {(renderProps) => (
        <div data-tree-item-content="" className={itemContent()}>
          {renderProps.allowsDragging && (
            <ButtonPrimitive.Button slot="drag" className={chevron()}>
              <GripVerticalIcon aria-hidden />
            </ButtonPrimitive.Button>
          )}
          {renderProps.selectionBehavior === 'toggle' &&
            renderProps.selectionMode !== 'none' && (
              <Checkbox slot="selection" />
            )}
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
          {typeof children === 'function' ? children(renderProps) : children}
        </div>
      )}
    </TreePrimitive.TreeItemContent>
  )
}

// MARK: Separator

export type { TreeItemContentProps, TreeItemProps, TreeProps }
export { Tree, TreeItem, TreeItemContent }
