import { ChevronRightIcon, GripVertical } from "lucide-react";
import {
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent as AriaTreeItemContent,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type {
  TreeItemContentProps as AriaTreeItemContentProps,
  TreeItemProps as AriaTreeItemProps,
  TreeProps as AriaTreeProps,
} from "react-aria-components";

import { Button } from "@dotui/registry/ui/button";
import { Checkbox } from "@dotui/registry/ui/checkbox";

const treeStyles = tv({
  slots: {
    root: "",
    item: "",
    itemContent: "flex items-center gap-2",
  },
});

const { root, item } = treeStyles();

/* -----------------------------------------------------------------------------------------------*/

interface TreeProps<T> extends AriaTreeProps<T> {}

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
  return (
    <AriaTree
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TreeItemProps extends AriaTreeItemProps {}

const TreeItem = ({ className, ...props }: TreeItemProps) => {
  return (
    <AriaTreeItem
      className={composeRenderProps(className, (cn) => item({ className: cn }))}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface TreeItemContentProps extends AriaTreeItemContentProps {}

const TreeItemContent = (_props: TreeItemContentProps) => {
  return (
    <AriaTreeItemContent>
      {({ selectionBehavior, selectionMode, allowsDragging }) => (
        <>
          {allowsDragging && (
            <Button slot="drag" variant="quiet" size="sm">
              <GripVertical size={18} />
            </Button>
          )}
          {selectionBehavior === "toggle" && selectionMode !== "none" && (
            <Checkbox slot="selection" />
          )}
          <Button slot="chevron" variant="quiet" size="sm">
            <ChevronRightIcon />
          </Button>
        </>
      )}
    </AriaTreeItemContent>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Tree, TreeItem, TreeItemContent };

export type { TreeProps, TreeItemProps, TreeItemContentProps };
