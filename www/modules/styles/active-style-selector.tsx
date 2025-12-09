"use client";

import { ListBoxSection, ListBoxSectionHeader } from "@dotui/registry/ui/list-box";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@dotui/registry/ui/select";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { SelectProps } from "@dotui/registry/ui/select";

import { useActiveStyle } from "@/modules/styles/use-active-style";
import { useFeaturedStyles } from "@/modules/styles/use-featured-styles";
import { useSetActiveStyle } from "@/modules/styles/use-set-active-style";
import { useUserStyles } from "@/modules/styles/use-user-styles";

export function ActiveStyleSelector({
	buttonProps,
	...props
}: SelectProps<object> & {
	buttonProps?: ButtonProps;
}) {
	const activeStyleQuery = useActiveStyle();
	const updateStyleMutation = useSetActiveStyle();

	const featuredStylesQuery = useFeaturedStyles();
	const userStylesQuery = useUserStyles();

	return (
		<Select
			aria-label="Active Style"
			defaultValue={activeStyleQuery.data?.id}
			onChange={(key) => {
				updateStyleMutation.mutate({
					styleId: key as string,
				});
			}}
			{...props}
		>
			<SelectTrigger {...buttonProps}>
				<span className="text-fg-muted">Style:</span>{" "}
				{activeStyleQuery.isPending ? (
					<span className="flex-1 truncate text-center">loading...</span>
				) : (
					<span className="flex-1 truncate text-center">
						<SelectValue />
					</span>
				)}
			</SelectTrigger>
			<SelectContent isLoading={featuredStylesQuery.isPending}>
				{userStylesQuery.isSuccess && userStylesQuery.data?.length > 0 && (
					<ListBoxSection>
						<ListBoxSectionHeader>My styles</ListBoxSectionHeader>
						{userStylesQuery.data
							?.filter((style) => !style.isFeatured)
							.map((style) => (
								<SelectItem key={style.id} id={style.id}>
									{style.name}
								</SelectItem>
							))}
					</ListBoxSection>
				)}
				{featuredStylesQuery.isSuccess && featuredStylesQuery.data?.length > 0 && (
					<ListBoxSection>
						<ListBoxSectionHeader>Featured</ListBoxSectionHeader>
						{featuredStylesQuery.data?.map((style) => (
							<SelectItem key={style.id} id={style.id}>
								{style.name}
							</SelectItem>
						))}
					</ListBoxSection>
				)}
			</SelectContent>
		</Select>
	);
}
