// AUTO-GENERATED — do not edit. Run `pnpm build:registry`.
// Structured shadcn registry CSS fields generated from www/src/registry/base/*.css.

import type { RegistryItem } from "@/registry/types";

export const baseRegistryCss = {
	css: {
		'@import "tw-animate-css"': {},
		'@plugin "tailwindcss-react-aria-components"': {},
		'@plugin "tailwindcss-with"': {},
		"@custom-variant dark (&:is(.dark *, [data-mode='dark'] *):not([data-mode='light'] *))": {},
		"@utility focus-reset": {
			"@apply ring-0 ring-transparent outline-none": {},
		},
		"@utility focus-ring": {
			"@apply ring-2 ring-border-focus ring-offset-2 ring-offset-bg": {},
		},
		"@utility focus-input": {
			"@apply border-border-focus ring-2 ring-border-focus-muted": {},
		},
		"@utility no-highlight": {
			"-webkit-tap-highlight-color": "transparent",
		},
		"@layer base": {
			"*": {
				"@apply border-border": {},
			},
			body: {
				"@apply bg-bg font-sans text-fg": {},
			},
			html: {
				"@apply font-sans": {},
			},
		},
		"::selection": {
			"@apply bg-text-selection text-fg-on-text-selection": {},
		},
		".lucide,\n.tabler-icon": {
			"stroke-width": "var(--icon-stroke-width, 2)",
		},
		".hugeicon,\n.hugeicon *": {
			"stroke-width": "var(--icon-stroke-width, 1.5)",
		},
	},
	cssVars: {
		theme: {
			"--ease-fluid-out": "cubic-bezier(0.32, 0.72, 0, 1)",
			"--cursor-interactive": "pointer",
			"--cursor-disabled": "not-allowed",
			"--radius-xs": "calc(var(--radius) * 0.25)",
			"--radius-sm": "calc(var(--radius) * 0.5)",
			"--radius-md": "calc(var(--radius) * 0.75)",
			"--radius-lg": "var(--radius)",
			"--radius-xl": "calc(var(--radius) * 1.5)",
			"--radius-2xl": "calc(var(--radius) * 2)",
			"--radius-3xl": "calc(var(--radius) * 3)",
			"--radius-4xl": "calc(var(--radius) * 4)",
			"--font-sans": "var(--font-geist-sans)",
			"--font-heading": "var(--font-sans)",
			"--font-mono": "var(--font-geist-mono)",
		},
	},
} as const satisfies Pick<RegistryItem, "css" | "cssVars">;
