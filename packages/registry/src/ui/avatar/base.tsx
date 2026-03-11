"use client";

import * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useImageLoadingStatus } from "@dotui/registry/hooks/use-image-loading-status";
import { createContext } from "@dotui/registry/lib/context";
import type { ImageLoadingStatus } from "@dotui/registry/hooks/use-image-loading-status";

const avatarStyles = tv({
	slots: {
		root: [
			"group/avatar relative inline-flex shrink-0 rounded-full bg-muted align-middle",
			"*:data-badge:absolute *:data-badge:not-with-[right]:not-with-[left]:right-0 *:data-badge:not-with-[bottom]:not-with-[top]:bottom-0",
		],
		image: "aspect-square size-full rounded-[inherit] object-cover",
		fallback:
			"flex size-full select-none items-center justify-center rounded-[inherit] bg-muted text-sm group-data-[size=sm]/avatar:text-xs",
		badge: [
			"absolute right-0 with-[left]:right-auto bottom-0 with-[top]:bottom-auto z-10 inline-flex select-none items-center justify-center rounded-full bg-primary text-fg-on-primary bg-blend-color ring-2 ring-bg",
			"not-with-[size]:group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
			"not-with-[size]:group-data-[size=md]/avatar:size-2.5 group-data-[size=md]/avatar:[&>svg]:size-2",
			"not-with-[size]:group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
		],
		group: "group/avatar-group flex -space-x-2 *:data-avatar:ring-2 *:data-avatar:ring-bg",
		groupCount:
			"relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-fg-muted text-sm ring-2 ring-bg group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
	},
	variants: {
		size: {
			sm: { group: "*:data-avatar:size-6", root: "size-6" },
			md: { group: "*:data-avatar:size-8", root: "size-8" },
			lg: { group: "*:data-avatar:size-10", root: "size-10" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const { group, root, image, fallback, badge, groupCount } = avatarStyles();

const [AvatarContext, useAvatarContext] = createContext<{
	status: ImageLoadingStatus;
	setStatus: (status: ImageLoadingStatus) => void;
}>({
	name: "Avatar",
	strict: true,
});

/* -------------------------------------------------------------------------------------------------
 * Avatar
 * -----------------------------------------------------------------------------------------------*/

interface AvatarProps extends React.ComponentProps<"span">, VariantProps<typeof avatarStyles> {}

function Avatar({ className, size = "md", ...props }: AvatarProps) {
	const [status, setStatus] = React.useState<ImageLoadingStatus>("idle");

	return (
		<AvatarContext value={{ status, setStatus }}>
			<span data-avatar="" data-size={size} className={root({ className, size })} {...props} />
		</AvatarContext>
	);
}

/* -------------------------------------------------------------------------------------------------
 * Avatar Image
 * -----------------------------------------------------------------------------------------------*/

interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
	src?: string;
}

function AvatarImage({ src, alt, className, referrerPolicy, crossOrigin, ...props }: AvatarImageProps) {
	const status = useImageLoadingStatus(src, { referrerPolicy, crossOrigin });
	const { setStatus } = useAvatarContext("AvatarImage");

	React.useLayoutEffect(() => {
		setStatus(status);
	}, [status, setStatus]);

	if (status === "loaded")
		return <img data-avatar-image="" className={image({ className })} src={src} alt={alt} {...props} />;

	return null;
}

/* -------------------------------------------------------------------------------------------------
 * Avatar Fallback
 * -----------------------------------------------------------------------------------------------*/

interface AvatarFallbackProps extends React.ComponentProps<"span"> {}

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
	const { status } = useAvatarContext("AvatarFallback");
	if (status !== "loaded")
		return <span data-avatar-fallback="" className={fallback({ className })} {...props} />;
	return null;
};

/* -------------------------------------------------------------------------------------------------
 * Avatar Badge
 * -----------------------------------------------------------------------------------------------*/

interface AvatarBadgeProps extends React.ComponentProps<"span"> {}

const AvatarBadge = ({ className, ...props }: AvatarBadgeProps) => {
	return <span data-avatar-badge="" className={badge({ className })} {...props} />;
};

/* -------------------------------------------------------------------------------------------------
 * Avatar Group
 * -----------------------------------------------------------------------------------------------*/

interface AvatarGroupProps extends React.ComponentProps<"div">, VariantProps<typeof avatarStyles> {}

const AvatarGroup = ({ className, size, ...props }: AvatarGroupProps) => {
	return <div data-avatar-group="" className={group({ className, size })} {...props} />;
};

/* -------------------------------------------------------------------------------------------------
 * Avatar Group Count
 * -----------------------------------------------------------------------------------------------*/

interface AvatarGroupCountProps extends React.ComponentProps<"span"> {}

const AvatarGroupCount = ({ className, ...props }: AvatarGroupCountProps) => {
	return <span data-avatar-group-count="" className={groupCount({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

export { AvatarGroup, Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroupCount };

export type {
	AvatarGroupProps,
	AvatarProps,
	AvatarImageProps,
	AvatarFallbackProps,
	AvatarBadgeProps,
	AvatarGroupCountProps,
};
