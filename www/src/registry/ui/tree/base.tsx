"use client"

import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as TreePrimitives from "react-aria-components/Tree"

import { ChevronRightIcon, GripVerticalIcon } from "@/registry/icons"
import { Checkbox } from "@/registry/ui/checkbox"

import { useStyles } from "./styles"

// MARK: Separator

interface TreeProps<T> extends TreePrimitives.TreeProps<T> {}

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
  const { root } = useStyles()()
  return (
    <TreePrimitives.Tree
      data-tree=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface TreeItemProps<T> extends TreePrimitives.TreeItemProps<T> {}

const TreeItem = <T extends object>({
  className,
  ...props
}: TreeItemProps<T>) => {
  const { item } = useStyles()()
  return (
    <TreePrimitives.TreeItem
      data-tree-item=""
      className={composeRenderProps(className, (className, renderProps) =>
        item({
          className,
          interactive:
            !renderProps.isDisabled &&
            (renderProps.selectionMode !== "none" || renderProps.hasChildItems),
        }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface TreeItemContentProps extends TreePrimitives.TreeItemContentProps {}

const TreeItemContent = ({ children, ...props }: TreeItemContentProps) => {
  const { itemContent, chevron, chevronPlaceholder, label } = useStyles()()
  return (
    <TreePrimitives.TreeItemContent {...props}>
      {(renderProps) => {
        const hasSelectionCheckbox =
          renderProps.selectionBehavior === "toggle" &&
          renderProps.selectionMode !== "none"
        const toggleExpandOnPress =
          renderProps.hasChildItems && !hasSelectionCheckbox
            ? () => renderProps.state.toggleKey(renderProps.id)
            : undefined
        return (
          <div data-tree-item-content="" className={itemContent()}>
            {renderProps.allowsDragging && (
              <ButtonPrimitives.Button slot="drag" className={chevron()}>
                <GripVerticalIcon aria-hidden />
              </ButtonPrimitives.Button>
            )}
            {hasSelectionCheckbox && <Checkbox slot="selection" />}
            {renderProps.hasChildItems ? (
              <ButtonPrimitives.Button slot="chevron" className={chevron()}>
                <ChevronRightIcon
                  aria-hidden
                  className="transition-transform duration-200 group-data-expanded/tree-item:rotate-90"
                />
              </ButtonPrimitives.Button>
            ) : (
              <span aria-hidden="true" className={chevronPlaceholder()} />
            )}
            <span className={label()} onClick={toggleExpandOnPress}>
              {typeof children === "function"
                ? children(renderProps)
                : children}
            </span>
          </div>
        )
      }}
    </TreePrimitives.TreeItemContent>
  )
}

// MARK: Separator

export type { TreeItemContentProps, TreeItemProps, TreeProps }
export { Tree, TreeItem, TreeItemContent }
