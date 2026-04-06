"use client";

import { XIcon } from "lucide-react";
import {
	Tag as AriaTag,
	TagGroup as AriaTagGroup,
	TagList as AriaTagList,
	composeRenderProps,
} from "react-aria-components";
import type {
	TagGroupProps as AriaTagGroupProps,
	TagListProps as AriaTagListProps,
	TagProps as AriaTagProps,
} from "react-aria-components";

import { Button } from "@/registry/ui/button";

import { useStyles } from "./styles";

// MARK: tagGroupStyles

// MARK: seperator

interface TagGroupProps extends AriaTagGroupProps {}

function TagGroup({ className, ...props }: TagGroupProps) {
	const { group } = useStyles()();
	return <AriaTagGroup {...props} className={group({ className })} />;
}

// MARK: seperator

interface TagListProps<T> extends AriaTagListProps<T> {}

function TagList<T extends object>(props: TagListProps<T>) {
	const { list } = useStyles()();
	return <AriaTagList {...props} className={composeRenderProps(props.className, (className) => list({ className }))} />;
}

// MARK: seperator

interface TagProps extends AriaTagProps {}

function Tag({ className, ...props }: TagProps) {
	const { tag } = useStyles()();
	const textValue = typeof props.children === "string" ? props.children : undefined;

	return (
		<AriaTag
			textValue={textValue}
			className={composeRenderProps(className, (className) => tag({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { allowsRemoving }) => (
				<>
					{children}
					{allowsRemoving && (
						<Button variant="quiet" slot="remove">
							<XIcon />
						</Button>
					)}
				</>
			))}
		</AriaTag>
	);
}

// MARK: seperator

export type { TagGroupProps, TagListProps, TagProps };
export { Tag, TagGroup, TagList };
