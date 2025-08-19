"use client";

import { z } from "zod";
import { COLOR_TOKENS } from "@dotui/registry-definition/registry-tokens";
import { styleDefinitionSchema } from "@dotui/style-engine/schemas";

export const formSchema = styleDefinitionSchema.extend({
	name: z.string().min(1),
	slug: z.string().min(1),
	description: z.string().nullable().optional(),
	id: z.string().optional(),
	userId: z.string().optional(),
	createdAt: z.date().optional(),
	updatedAt: z.date().nullable().optional(),
	isFeatured: z.boolean().optional(),
	visibility: z.enum(["public", "unlisted", "private"]).optional(),
});

export type StyleFormData = z.infer<typeof formSchema>;

export const fakeData: StyleFormData = {
	name: "Minimalist",
	slug: "minimalist",
	description: "",
	theme: {
		colors: {
			activeModes: ["light", "dark"],
			modes: {
				light: {
					lightness: 97,
					saturation: 100,
					contrast: 100,
					scales: {
						neutral: {
							name: "neutral",
							colorKeys: [{ id: 0, color: "#000000" }],
							ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						accent: {
							name: "accent",
							colorKeys: [{ id: 0, color: "#0091FF" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						success: {
							name: "success",
							colorKeys: [{ id: 0, color: "#1A9338" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						warning: {
							name: "warning",
							colorKeys: [{ id: 0, color: "#E79D13" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						danger: {
							name: "danger",
							colorKeys: [{ id: 0, color: "#D93036" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						info: {
							name: "info",
							colorKeys: [{ id: 0, color: "#0091FF" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
					},
				},
				dark: {
					lightness: 3,
					saturation: 100,
					contrast: 100,
					scales: {
						neutral: {
							name: "neutral",
							colorKeys: [{ id: 0, color: "#ffffff" }],
							ratios: [1.05, 1.25, 1.7, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						accent: {
							name: "accent",
							colorKeys: [{ id: 0, color: "#0091FF" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						success: {
							name: "success",
							colorKeys: [{ id: 0, color: "#1A9338" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						warning: {
							name: "warning",
							colorKeys: [{ id: 0, color: "#E79D13" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						danger: {
							name: "danger",
							colorKeys: [{ id: 0, color: "#D93036" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
						info: {
							name: "info",
							colorKeys: [{ id: 0, color: "#0091FF" }],
							ratios: [1.25, 1.5, 1.8, 2.25, 3.15, 4.8, 6.35, 8.3, 13.2, 15.2],
							overrides: {},
							smooth: false,
						},
					},
				},
			},
			tokens: COLOR_TOKENS.map((token) => ({
				id: token.name,
				name: token.name,
				value: token.defaultValue,
			})),
		},
		radius: 1,
		spacing: 0.25,
		fonts: {
			heading: "Inter",
			body: "Inter",
		},
		letterSpacing: 0,
		backgroundPattern: "none",
		texture: "none",
		shadows: {
			color: "#000000",
			opacity: 0.1,
			blurRadius: 10,
			offsetX: 0,
			offsetY: 1,
			spread: 0,
		},
	},
	icons: {
		library: "lucide",
		strokeWidth: 1.5,
	},
	variants: {
		alert: "basic",
		buttons: "basic",
		loader: "ring",
		"focus-style": "basic",
		inputs: "basic",
		pickers: "basic",
		selection: "basic",
		calendars: "basic",
		"list-box-and-menu": "basic",
		overlays: "basic",
		checkboxes: "basic",
		radios: "basic",
		switch: "basic",
		slider: "basic",
		"badge-and-tag-group": "basic",
		tooltip: "basic",
	},
};

