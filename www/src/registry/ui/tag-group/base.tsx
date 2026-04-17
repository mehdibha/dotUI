"use client";

import { XIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TagGroupPrimitives from "react-aria-components/TagGroup";

import { Button } from "@/registry/ui/button";

import { useStyles } from "./styles";

// MARK: tagGroupStyles

// MARK: seperator

interface TagGroupProps extends TagGroupPrimitives.TagGroupProps {}

function TagGroup({ className, ...props }: TagGroupProps) {
	const { group } = useStyles()();
	return <TagGroupPrimitives.TagGroup {...props} className={group({ className })} />;
}

// MARK: seperator

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

// MARK: seperator

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
						<Button variant="quiet" size="icon" slot="remove">
							<XIcon />
						</Button>
					)}
				</>
			))}
		</TagGroupPrimitives.Tag>
	);
}

// MARK: seperator

export type { TagGroupProps, TagListProps, TagProps };
export { Tag, TagGroup, TagList };
