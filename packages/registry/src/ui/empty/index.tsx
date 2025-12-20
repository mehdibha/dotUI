"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type {
	EmptyContentProps,
	EmptyDescriptionProps,
	EmptyHeaderProps,
	EmptyMediaProps,
	EmptyProps,
	EmptyTitleProps,
} from "./types";

export const Empty = createDynamicComponent<EmptyProps>("empty", "Empty", Default.Empty, {});

export const EmptyHeader = createDynamicComponent<EmptyHeaderProps>("empty", "EmptyHeader", Default.EmptyHeader, {});

export const EmptyTitle = createDynamicComponent<EmptyTitleProps>("empty", "EmptyTitle", Default.EmptyTitle, {});
export const EmptyDescription = createDynamicComponent<EmptyDescriptionProps>(
	"empty",
	"EmptyDescription",
	Default.EmptyDescription,
	{},
);

export const EmptyContent = createDynamicComponent<EmptyContentProps>(
	"empty",
	"EmptyContent",
	Default.EmptyContent,
	{},
);
export const EmptyMedia = createDynamicComponent<EmptyMediaProps>("empty", "EmptyMedia", Default.EmptyMedia, {});

export type {
	EmptyProps,
	EmptyHeaderProps,
	EmptyTitleProps,
	EmptyDescriptionProps,
	EmptyContentProps,
	EmptyMediaProps,
};
