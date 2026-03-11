"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type {
	AvatarBadgeProps,
	AvatarFallbackProps,
	AvatarGroupCountProps,
	AvatarGroupProps,
	AvatarImageProps,
	AvatarProps,
} from "./types";

export const Avatar = createDynamicComponent<AvatarProps>("avatar", "Avatar", Default.Avatar, {});

export const AvatarImage = createDynamicComponent<AvatarImageProps>("avatar", "AvatarImage", Default.AvatarImage, {});

export const AvatarFallback = createDynamicComponent<AvatarFallbackProps>(
	"avatar",
	"AvatarFallback",
	Default.AvatarFallback,
	{},
);

export const AvatarBadge = createDynamicComponent<AvatarBadgeProps>("avatar", "AvatarBadge", Default.AvatarBadge, {});

export const AvatarGroup = createDynamicComponent<AvatarGroupProps>("avatar", "AvatarGroup", Default.AvatarGroup, {});

export const AvatarGroupCount = createDynamicComponent<AvatarGroupCountProps>(
	"avatar",
	"AvatarGroupCount",
	Default.AvatarGroupCount,
	{},
);

export type {
	AvatarProps,
	AvatarImageProps,
	AvatarFallbackProps,
	AvatarBadgeProps,
	AvatarGroupProps,
	AvatarGroupCountProps,
};
