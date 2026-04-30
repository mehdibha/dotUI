"use client";

import { XIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TagGroupPrimitives from "react-aria-components/TagGroup";
import type { VariantProps } from "tailwind-variants";

import { Button } from "@/registry/ui/button";

import { useStyles } from "./styles";
import type { TagGroupStyles } from "./styles";

// MARK: TagGroup

interface TagGroupProps extends TagGroupPrimitives.TagGroupProps {}

function TagGroup({ className, ...props }: TagGroupProps) {
	const { tagGroup } = useStyles()();
	return <TagGroupPrimitives.TagGroup data-tag-group="" className={tagGroup({ className })} {...props} />;
}

// MARK: TagList

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

// MARK: Tag

type TagVariants = VariantProps<TagGroupStyles>;

interface TagProps extends TagGroupPrimitives.TagProps, TagVariants {}

function Tag({ className, variant, color, size, ...props }: TagProps) {
	const { tag } = useStyles()();
	const textValue = typeof props.children === "string" ? props.children : undefined;

	return (
		<TagGroupPrimitives.Tag
			data-tag=""
			textValue={textValue}
			className={composeRenderProps(className, (className) => tag({ className, variant, color, size }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { allowsRemoving }) => (
				<>
					{children}
					{allowsRemoving && (
						<Button variant="quiet" isIconOnly slot="remove" size="xs">
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
