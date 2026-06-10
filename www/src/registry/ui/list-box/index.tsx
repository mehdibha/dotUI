import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { ListBoxItem as ListBoxItemPrimitive } from "./base";

import type { ListBoxItemProps as BaseListBoxItemProps } from "./base";

export {
	ListBox,
	ListBoxItemDescription,
	ListBoxItemLabel,
	ListBoxSection,
	ListBoxSectionHeader,
	ListBoxVirtualizer,
} from "./base";
export type {
	ListBoxItemDescriptionProps,
	ListBoxItemLabelProps,
	ListBoxProps,
	ListBoxSectionHeaderProps,
	ListBoxSectionProps,
	ListBoxVirtualizerProps,
} from "./base";

type ListBoxItemProps<T> = Omit<BaseListBoxItemProps<T>, "href"> & { href?: string | ToOptions };

function ListBoxItem<T extends object>({ href, ...props }: ListBoxItemProps<T>) {
	// Only pass `href`/`render` for actual links: an explicit `href={undefined}`
	// still counts as a link prop to react-aria (`'href' in props`), which turns
	// every plain item into an <a href="">.
	const hrefString = typeof href === "object" ? href.to : href;
	if (!hrefString) {
		return <ListBoxItemPrimitive {...props} />;
	}
	return (
		<ListBoxItemPrimitive
			href={hrefString}
			render={(domProps) => {
				// The `in` check narrows the div|anchor props union; render is only
				// passed for links, so the div branch is a type-level fallback.
				if (!("href" in domProps)) {
					return <div {...domProps} />;
				}
				if (typeof href === "object") {
					return <RouterLink {...href} {...domProps} />;
				}
				return <a {...domProps} />;
			}}
			{...props}
		/>
	);
}

export type { ListBoxItemProps };
export { ListBoxItem };
