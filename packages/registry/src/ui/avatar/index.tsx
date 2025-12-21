"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type {
	AvatarFallbackProps,
	AvatarGroupProps,
	AvatarImageProps,
	AvatarPlaceholderProps,
	AvatarProps,
	AvatarRootProps,
} from "./types";

export const AvatarGroup = createDynamicComponent<AvatarGroupProps>("avatar", "AvatarGroup", Default.AvatarGroup, {});

export const Avatar = createDynamicComponent<AvatarProps>("avatar", "Avatar", Default.Avatar, {});

export const AvatarRoot = createDynamicComponent<AvatarRootProps>("avatar", "AvatarRoot", Default.AvatarRoot, {});

export const AvatarImage = createDynamicComponent<AvatarImageProps>("avatar", "AvatarImage", Default.AvatarImage, {});

export const AvatarFallback = createDynamicComponent<AvatarFallbackProps>(
	"avatar",
	"AvatarFallback",
	Default.AvatarFallback,
	{},
);

export const AvatarPlaceholder = createDynamicComponent<AvatarPlaceholderProps>(
	"avatar",
	"AvatarPlaceholder",
	Default.AvatarPlaceholder,
	{},
);

export type {
	AvatarProps,
	AvatarRootProps,
	AvatarImageProps,
	AvatarFallbackProps,
	AvatarGroupProps,
	AvatarPlaceholderProps,
};
