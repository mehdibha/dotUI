"use client";

import * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { useImageLoadingStatus } from "@/registry/hooks/use-image-loading-status";
import { createContext } from "@/registry/lib/context";
import type { ImageLoadingStatus } from "@/registry/hooks/use-image-loading-status";

import { useStyles } from "./styles";
import type { AvatarStyles } from "./styles";

// MARK: avatarStyles

const [AvatarContext, useAvatarContext] = createContext<{
	status: ImageLoadingStatus;
	setStatus: (status: ImageLoadingStatus) => void;
}>({
	name: "Avatar",
	strict: true,
});

// MARK: seperator

interface AvatarProps extends React.ComponentProps<"span">, VariantProps<AvatarStyles> {}

function Avatar({ className, size = "md", ...props }: AvatarProps) {
	const { root } = useStyles()();
	const [status, setStatus] = React.useState<ImageLoadingStatus>("idle");

	return (
		<AvatarContext value={{ status, setStatus }}>
			<span data-avatar="" data-size={size} className={root({ className, size })} {...props} />
		</AvatarContext>
	);
}

// MARK: seperator

interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
	src?: string;
}

function AvatarImage({ src, alt, className, referrerPolicy, crossOrigin, ...props }: AvatarImageProps) {
	const { image } = useStyles()();
	const status = useImageLoadingStatus(src, { referrerPolicy, crossOrigin });
	const { setStatus } = useAvatarContext("AvatarImage");

	React.useLayoutEffect(() => {
		setStatus(status);
	}, [status, setStatus]);

	if (status === "loaded")
		return <img data-avatar-image="" className={image({ className })} src={src} alt={alt} {...props} />;

	return null;
}

// MARK: seperator

interface AvatarFallbackProps extends React.ComponentProps<"span"> {}

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
	const { fallback } = useStyles()();
	const { status } = useAvatarContext("AvatarFallback");
	if (status !== "loaded") return <span data-avatar-fallback="" className={fallback({ className })} {...props} />;
	return null;
};

// MARK: seperator

interface AvatarBadgeProps extends React.ComponentProps<"span"> {}

const AvatarBadge = ({ className, ...props }: AvatarBadgeProps) => {
	const { badge } = useStyles()();
	return <span data-avatar-badge="" className={badge({ className })} {...props} />;
};

// MARK: seperator

interface AvatarGroupProps extends React.ComponentProps<"div">, VariantProps<AvatarStyles> {}

const AvatarGroup = ({ className, size, ...props }: AvatarGroupProps) => {
	const { group } = useStyles()();
	return <div data-avatar-group="" className={group({ className, size })} {...props} />;
};

// MARK: seperator

interface AvatarGroupCountProps extends React.ComponentProps<"span"> {}

const AvatarGroupCount = ({ className, ...props }: AvatarGroupCountProps) => {
	const { groupCount } = useStyles()();
	return <span data-avatar-group-count="" className={groupCount({ className })} {...props} />;
};

// MARK: seperator

export type {
	AvatarBadgeProps,
	AvatarFallbackProps,
	AvatarGroupCountProps,
	AvatarGroupProps,
	AvatarImageProps,
	AvatarProps,
};
export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };
