"use client";

import { XIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TagGroupPrimitives from "react-aria-components/TagGroup";
import type { VariantProps } from "tailwind-variants";

import { Button } from "@/registry/ui/button";

import { type TagGroupStyles, useStyles } from "./styles";

// MARK: Separator

interface TagGroupProps extends TagGroupPrimitives.TagGroupProps, VariantProps<TagGroupStyles> {}

function TagGroup({ className, size, ...props }: TagGroupProps) {
	const { tagGroup } = useStyles()();
	return <TagGroupPrimitives.TagGroup data-tag-group="" className={tagGroup({ className })} {...props} />;
}

// MARK: Separator

interface TagListProps<T> extends TagGroupPrimitives.TagListProps<T> {}

function TagList<T extends object>({ className, ...props }: TagListProps<T>) {
	const { tagList } = useStyles()();
	return (
		<TagGroupPrimitives.TagList
			data-tag-list=""
			className={composeRenderProps(className, (cn) => tagList({ className: cn }))}
			{...props}
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
			data-tag=""
			textValue={textValue}
			className={composeRenderProps(className, (className) => tag({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { allowsRemoving }) => (
				<>
					{children}
					{allowsRemoving && (
						<Button slot="remove" variant="quiet" isIconOnly size="xs">
							<XIcon />
						</Button>
					)}
				</>
			))}
		</TagGroupPrimitives.Tag>
	);
}

// MARK: exports

export type { TagGroupProps, TagListProps, TagProps };
export { Tag, TagGroup, TagList };
