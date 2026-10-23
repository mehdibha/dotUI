"use client";

import * as ButtonPrimitives from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TreePrimitives from "react-aria-components/Tree";

import { ChevronRightIcon, GripVerticalIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { tv } from "tailwind-variants";

const treeVariants = tv({
  slots: {
    root: "flex max-h-[inherit] flex-col gap-px overflow-auto outline-hidden data-empty:items-center data-empty:justify-center text-base [--tree-indent:--spacing(6)]",
    item: "group/tree-item relative flex w-full items-center rounded-xs outline-hidden select-ui **:[svg]:pointer-events-none **:[svg]:shrink-0 focus-visible:focus-ring-inside selected:bg-selected/50 selected:text-fg-on-selected selected:hover:bg-selected/70 drop-target:bg-selected/30 drop-target:text-fg dragging:opacity-60 disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor) disabled:**:text-current min-h-12 px-3 py-2 text-base **:[svg]:not-with-[size]:size-5",
    itemContent:
      "flex min-w-0 flex-1 items-center gap-1.5 ps-[calc((var(--tree-item-level)-1)*var(--tree-indent))]",
    chevron:
      "flex size-4 shrink-0 cursor-interactive items-center justify-center text-fg-muted outline-hidden",
    chevronPlaceholder: "size-4 shrink-0",
    label: "flex min-w-0 flex-1 items-center gap-1.5",
  },
  variants: {
    interactive: {
      true: {
        item: "cursor-interactive hover:bg-muted",
      },
      false: {},
    },
  },
  defaultVariants: {
    interactive: false,
  },
});

const { root, item, itemContent, chevron, chevronPlaceholder, label } =
  treeVariants();

/* -------------------------------------------------------------------------- */

interface TreeProps<T> extends TreePrimitives.TreeProps<T> {}

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
  return (
    <TreePrimitives.Tree
      data-tree=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface TreeItemProps<T> extends TreePrimitives.TreeItemProps<T> {}

const TreeItem = <T extends object>({
  className,
  ...props
}: TreeItemProps<T>) => {
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
  );
};

/* -------------------------------------------------------------------------- */

interface TreeItemContentProps extends TreePrimitives.TreeItemContentProps {}

const TreeItemContent = ({ children, ...props }: TreeItemContentProps) => {
  return (
    <TreePrimitives.TreeItemContent {...props}>
      {(renderProps) => {
        const hasSelectionCheckbox =
          renderProps.selectionBehavior === "toggle" &&
          renderProps.selectionMode !== "none";
        const toggleExpandOnPress =
          renderProps.hasChildItems && !hasSelectionCheckbox
            ? () => renderProps.state.toggleKey(renderProps.id)
            : undefined;
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
        );
      }}
    </TreePrimitives.TreeItemContent>
  );
};

/* -------------------------------------------------------------------------- */

export type { TreeItemContentProps, TreeItemProps, TreeProps };
export { Tree, TreeItem, TreeItemContent };
