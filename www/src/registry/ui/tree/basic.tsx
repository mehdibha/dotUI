import { ChevronRightIcon, GripVertical } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TreePrimitives from "react-aria-components/Tree";
import { tv } from "tailwind-variants";

import { Button } from "@/registry/ui/button";
import { Checkbox } from "@/registry/ui/checkbox";

const treeStyles = tv({
	slots: {
		root: "",
		item: "",
		itemContent: "flex items-center gap-2",
	},
});

const { root, item } = treeStyles();

/* -----------------------------------------------------------------------------------------------*/

interface TreeProps<T> extends TreePrimitives.TreeProps<T> {}

const Tree = <T extends object>({ className, ...props }: TreeProps<T>) => {
	return <TreePrimitives.Tree className={composeRenderProps(className, (cn) => root({ className: cn }))} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface TreeItemProps extends TreePrimitives.TreeItemProps {}

const TreeItem = ({ className, ...props }: TreeItemProps) => {
	return (
		<TreePrimitives.TreeItem className={composeRenderProps(className, (cn) => item({ className: cn }))} {...props} />
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface TreeItemContentProps extends TreePrimitives.TreeItemContentProps {}

const TreeItemContent = (_props: TreeItemContentProps) => {
	return (
		<TreePrimitives.TreeItemContent>
			{({ selectionBehavior, selectionMode, allowsDragging }) => (
				<>
					{allowsDragging && (
						<Button slot="drag" variant="quiet" size="sm">
							<GripVertical size={18} />
						</Button>
					)}
					{selectionBehavior === "toggle" && selectionMode !== "none" && <Checkbox slot="selection" />}
					<Button slot="chevron" variant="quiet" size="sm" isIconOnly>
						<ChevronRightIcon />
					</Button>
				</>
			)}
		</TreePrimitives.TreeItemContent>
	);
};

/* -----------------------------------------------------------------------------------------------*/

export type { TreeItemContentProps, TreeItemProps, TreeProps };
export { Tree, TreeItem, TreeItemContent };
