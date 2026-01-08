"use client";

import * as React from "react";
import { tv } from "tailwind-variants";
import type { VariantProps } from "tailwind-variants";

import { useImageLoadingStatus } from "@dotui/registry/hooks/use-image-loading-status";
import { createContext } from "@dotui/registry/lib/context";
import type { ImageLoadingStatus } from "@dotui/registry/hooks/use-image-loading-status";

const avatarStyles = tv({
	slots: {
		group: "flex flex-wrap -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-bg",
		root: "relative inline-flex shrink-0 overflow-hidden rounded-full bg-bg align-middle",
		image: "aspect-square size-full",
		fallback: "flex size-full select-none items-center justify-center bg-muted",
		placeholder: "flex size-full h-full animate-pulse items-center justify-center bg-muted",
	},
	variants: {
		size: {
			sm: { group: "*:data-[slot=avatar]:size-8", root: "size-8" },
			md: { group: "*:data-[slot=avatar]:size-10", root: "size-10" },
			lg: { group: "*:data-[slot=avatar]:size-12", root: "size-12" },
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const { group, root, image, fallback, placeholder } = avatarStyles();

/* -----------------------------------------------------------------------------------------------*/

interface AvatarGroupProps extends React.ComponentProps<"div">, VariantProps<typeof avatarStyles> {}

const AvatarGroup = ({ className, size, ...props }: AvatarGroupProps) => {
	return <div className={group({ className, size })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface AvatarProps extends AvatarImageProps, VariantProps<typeof avatarStyles> {
	fallback?: React.ReactNode;
}
const Avatar = ({ className, style, fallback, size, ...props }: AvatarProps) => {
	return (
		<AvatarRoot className={className} style={style} size={size}>
			<AvatarImage {...props} />
			<AvatarFallback>{fallback}</AvatarFallback>
			<AvatarPlaceholder />
		</AvatarRoot>
	);
};

/* -----------------------------------------------------------------------------------------------*/

const [AvatarInternalContext, useAvatarInternalContext] = createContext<{
	status: ImageLoadingStatus;
	setStatus: (status: ImageLoadingStatus) => void;
}>({
	name: "AvatarRoot",
	strict: true,
});

interface AvatarRootProps extends React.ComponentProps<"span">, VariantProps<typeof avatarStyles> {}
function AvatarRoot({ className, size, ...props }: AvatarRootProps) {
	const [status, setStatus] = React.useState<ImageLoadingStatus>("idle");

	return (
		<AvatarInternalContext value={{ status, setStatus }}>
			<span data-slot="avatar" className={root({ className, size })} {...props} />
		</AvatarInternalContext>
	);
}

/* -----------------------------------------------------------------------------------------------*/

interface AvatarImageProps extends Omit<React.ComponentProps<"img">, "src"> {
	src?: string;
}

function AvatarImage({ src, alt, className, referrerPolicy, crossOrigin, ...props }: AvatarImageProps) {
	const status = useImageLoadingStatus(src, { referrerPolicy, crossOrigin });
	const { setStatus } = useAvatarInternalContext("AvatarImage");

	React.useLayoutEffect(() => {
		if (status !== "idle") {
			setStatus(status);
		}
	}, [status, setStatus]);

	if (status === "loaded")
		return <img slot="avatar-image" className={image({ className })} src={src} alt={alt} {...props} />;

	return null;
}

/* -----------------------------------------------------------------------------------------------*/

type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

const AvatarFallback = ({ className, ...props }: AvatarFallbackProps) => {
	const { status } = useAvatarInternalContext("AvatarFallback");
	if (status === "error") return <span slot="avatar-fallback" className={fallback({ className })} {...props} />;
	return null;
};

/* -----------------------------------------------------------------------------------------------*/

interface AvatarPlaceholderProps extends React.ComponentProps<"span"> {}

const AvatarPlaceholder = ({ className, ...props }: AvatarPlaceholderProps) => {
	const { status } = useAvatarInternalContext("AvatarPlaceholder");
	if (["idle", "loading"].includes(status)) return <span className={placeholder({ className })} {...props} />;
	return null;
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundAvatar = Object.assign(Avatar, {
	Group: AvatarGroup,
	Root: AvatarRoot,
	Image: AvatarImage,
	Fallback: AvatarFallback,
	Placeholder: AvatarPlaceholder,
});

export { CompoundAvatar as Avatar, AvatarGroup, AvatarRoot, AvatarImage, AvatarFallback, AvatarPlaceholder };

export type {
	AvatarGroupProps,
	AvatarProps,
	AvatarRootProps,
	AvatarImageProps,
	AvatarFallbackProps,
	AvatarPlaceholderProps,
};
