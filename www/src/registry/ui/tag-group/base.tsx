"use client";

import { XIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TagGroupPrimitives from "react-aria-components/TagGroup";

import { Button } from "@/registry/ui/button";

import { useStyles } from "./styles";

// MARK: tagGroupStyles

// MARK: Separator

interface TagGroupProps extends TagGroupPrimitives.TagGroupProps {}

function TagGroup({ className, ...props }: TagGroupProps) {
	const { group } = useStyles()();
	return <TagGroupPrimitives.TagGroup {...props} className={group({ className })} />;
}

// MARK: Separator

interface TagListProps<T> extends TagGroupPrimitives.TagListProps<T> {}

function TagList<T extends object>(props: TagListProps<T>) {
	const { list } = useStyles()();
	return (
		<TagGroupPrimitives.TagList
			{...props}
			className={composeRenderProps(props.className, (className) => list({ className }))}
		/>
	);
}

// MARK: Separator

interface TagProps extends TagGroupPrimitives.TagProps {}

function Tag({ className, ...props }: TagProps) {
	const { tag } = useStyles()();
	const textValue = typeof props.children === "string" ? props.children : undefined;

	return (
		<TagGroupPrimitives.Tag
			textValue={textValue}
			className={composeRenderProps(className, (className) => tag({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { allowsRemoving }) => (
				<>
					{children}
					{allowsRemoving && (
						<Button variant="quiet" isIconOnly slot="remove">
							<XIcon />
						</Button>
					)}
				</>
			))}
		</TagGroupPrimitives.Tag>
	);
}

// MARK: Separator

export type { TagGroupProps, TagListProps, TagProps };
export { Tag, TagGroup, TagList };
