// AUTO-GENERATED — do not edit. Run `pnpm build:registry`.
// Structured shadcn registry CSS fields generated from www/src/registry/base/*.css.

import type { RegistryItem } from "@/registry/types";

export const baseRegistryCss = {
	css: {
		'@import "tw-animate-css"': {},
		'@plugin "tailwindcss-react-aria-components"': {},
		'@plugin "tailwindcss-with"': {},
		"@custom-variant dark (&:is(.dark *))": {},
		"@utility focus-ring": {
			outline: "var(--studio-focus-width) solid var(--studio-focus-color)",
			"outline-offset": "var(--studio-focus-offset)",
		},
		"@utility focus-input": {
			"border-color": "var(--color-border-focus)",
			outline: "var(--studio-field-focus-width) solid var(--studio-field-focus-color)",
			"outline-offset": "var(--studio-field-focus-offset)",
			"@variant invalid": {
				"border-color": "var(--color-fg-danger)",
				"outline-color": "var(--studio-field-invalid-color)",
			},
		},
		"@utility invalid-ring": {
			"--tw-ring-shadow": "0 0 0 var(--invalid-ring-width) var(--color-danger-muted)",
			"box-shadow":
				"var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)",
		},
		"@utility invalid-ring-underline": {
			"--tw-ring-shadow": "0 var(--invalid-ring-width) 0 0 var(--color-danger-muted)",
			"box-shadow":
				"var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)",
		},
		"@utility invalid-fill": {
			"background-image": "var(--invalid-icon, none), linear-gradient(var(--invalid-fill), var(--invalid-fill))",
		},
		"@utility no-highlight": {
			"-webkit-tap-highlight-color": "transparent",
		},
		"@utility select-ui": {
			"-webkit-user-select": "var(--user-select-ui, none)",
			"user-select": "var(--user-select-ui, none)",
		},
		"@layer base": {
			"*": {
				"@apply border-border": {},
			},
			"h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6": {
				"font-family": "var(--font-heading)",
				"font-weight": "var(--font-weight-heading, var(--font-weight-semibold))",
				"letter-spacing": "var(--tracking-heading, 0)",
			},
			body: {
				"@apply bg-bg font-sans text-fg": {},
			},
			':is([data-disabled], :disabled, [aria-disabled="true"]):not(\n    [data-pending],\n    [data-current],\n    :is([data-disabled], :disabled, [aria-disabled="true"]) *\n  )':
				{
					opacity: "var(--disabled-opacity, 1)",
				},
		},
		":root": {
			"--card-border": "var(--color-border)",
			"--overlay-border": "var(--color-border)",
			"--popover-alpha": "100%",
			"--popover-backdrop-filter": "none",
			"--invalid-fill": "transparent",
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
			"--cursor-interactive": "pointer",
			"--cursor-pending": "default",
			"--cursor-disabled": "not-allowed",
			"--cursor-drag": "var(--cursor-interactive)",
			"--cursor-dragging": "var(--cursor-interactive)",
			"--color-scrim": "color-mix(in oklab, var(--color-overlay) 40%, transparent)",
			"--invalid-ring-width": "0px",
			"--disabled-bg": "var(--color-disabled)",
			"--disabled-fg": "var(--color-fg-disabled)",
			"--disabled-border": "var(--color-border)",
			"--disabled-selected-bg": "var(--color-disabled)",
			"--disabled-selected-fg": "var(--color-fg-disabled)",
			"--disabled-unselected-bg": "transparent",
			"--radius-xs": "calc(var(--radius) * 0.25)",
			"--radius-sm": "calc(var(--radius) * 0.5)",
			"--radius-md": "calc(var(--radius) * 0.75)",
			"--radius-lg": "var(--radius)",
			"--radius-xl": "calc(var(--radius) * 1.5)",
			"--radius-2xl": "calc(var(--radius) * 2)",
			"--radius-3xl": "calc(var(--radius) * 3)",
			"--radius-4xl": "calc(var(--radius) * 4)",
			"--radius-full": "calc(infinity * 1px)",
			"--font-sans": "var(--font-geist-sans)",
			"--font-heading": "var(--font-sans)",
			"--font-mono": "var(--font-geist-mono)",
			"--font-reading": "var(--font-sans)",
		},
	},
} as const satisfies Pick<RegistryItem, "css" | "cssVars">;
