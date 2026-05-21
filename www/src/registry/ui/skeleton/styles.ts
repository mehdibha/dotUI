import { createStyles } from "@/modules/core/styles";

import skeletonMeta from "./meta";

const { useStyles, styles } = createStyles(skeletonMeta, {
	base: {
		slots: {
			root: [
				"group/skeleton pointer-events-none select-none",

				/* Explicit skeleton intents */
				"**:data-[skeleton=text]:rounded-sm **:data-[skeleton=text]:text-transparent",
				"**:data-[skeleton=block]:skeleton **:data-[skeleton=text]:skeleton",
				"**:data-[skeleton=circle]:skeleton **:data-[skeleton=circle]:rounded-full",
				"**:data-[skeleton=control]:skeleton **:data-[skeleton=control]:border-transparent **:data-[skeleton=control]:text-transparent",
				"**:data-[skeleton=media]:skeleton",

				/* Text-like dotUI anatomy */
				"**:data-text:skeleton **:data-text:rounded-sm **:data-text:text-transparent",
				"**:data-label:skeleton **:data-label:rounded-sm **:data-label:text-transparent",
				"**:data-description:skeleton **:data-description:rounded-sm **:data-description:text-transparent",
				"**:data-card-title:skeleton **:data-card-title:rounded-sm **:data-card-title:text-transparent",
				"**:data-card-description:skeleton **:data-card-description:rounded-sm **:data-card-description:text-transparent",
				"**:data-menu-item-label:skeleton **:data-menu-item-label:rounded-sm **:data-menu-item-label:text-transparent",
				"**:data-menu-item-description:skeleton **:data-menu-item-description:rounded-sm **:data-menu-item-description:text-transparent",
				"**:data-listbox-item-label:skeleton **:data-listbox-item-label:rounded-sm **:data-listbox-item-label:text-transparent",
				"**:data-listbox-item-description:skeleton **:data-listbox-item-description:rounded-sm **:data-listbox-item-description:text-transparent",

				/* Controls and compact UI primitives */
				"**:data-button:skeleton **:data-button:border-transparent **:data-button:text-transparent **:data-button:shadow-none",
				"**:data-input-control:skeleton **:data-input-control:border-transparent **:data-input-control:text-transparent **:data-input-control:placeholder:text-transparent",
				"**:data-badge:skeleton **:data-badge:border-transparent **:data-badge:text-transparent",
				"**:data-tag:skeleton **:data-tag:border-transparent **:data-tag:text-transparent",
				"**:data-kbd:skeleton **:data-kbd:border-transparent **:data-kbd:text-transparent",
				"**:data-combobox-value:skeleton **:data-combobox-value:rounded-sm **:data-combobox-value:text-transparent",

				/* Media / identity */
				"**:data-avatar:skeleton **:data-avatar:text-transparent",
				"**:data-avatar-group-count:skeleton **:data-avatar-group-count:text-transparent",

				/* Preserve geometry, hide real visuals. */
				"[&_[data-avatar-group-count]_*]:invisible [&_[data-avatar]_*]:invisible",
				"[&_[data-badge]_*]:invisible [&_[data-button]_*]:invisible [&_[data-kbd]_*]:invisible [&_[data-tag]_*]:invisible",
				"[&_[data-skeleton=circle]_*]:invisible [&_[data-skeleton=control]_*]:invisible [&_[data-skeleton=media]_*]:invisible",
			],
		},
	},
	params: {
		animation: {
			shimmer: {
				slots: {
					root: "skeleton--shimmer",
				},
			},
			pulse: {
				slots: {
					root: "skeleton--pulse",
				},
			},
			none: {
				slots: {
					root: "skeleton--none",
				},
			},
		},
	},
});

export type SkeletonStyles = typeof styles;

export { styles as skeletonStyles, useStyles };
