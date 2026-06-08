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
	return (
		<ListBoxItemPrimitive
			href={href == null ? undefined : typeof href === "object" ? href.to : href}
			render={(domProps) => {
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
