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
			"--tw-ring-shadow":
				"inset 0 0 0 var(--focus-ring-inner) var(--color-bg),\n    var(--focus-ring-inset,) 0 0 0 var(--focus-ring-offset) var(--color-bg),\n    var(--focus-ring-inset,) 0 0 0\n      calc(var(--focus-ring-offset) + var(--focus-ring-width))\n      var(--focus-ring-color)",
			"box-shadow":
				"var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000),\n    var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000)",
		},
		"@utility focus-input": {
			"--tw-ring-shadow":
				"inset 0 0 0 var(--focus-input-inner) var(--color-bg),\n    var(--focus-input-inset,) 0 0 0 var(--focus-input-offset) var(--color-bg),\n    var(--focus-input-inset,) 0 0 0\n      calc(var(--focus-input-offset) + var(--focus-input-width))\n      var(--tw-ring-color, var(--focus-input-color))",
			"box-shadow":
				"var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000),\n    var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow),\n    var(--tw-shadow, 0 0 #0000)",
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
				"corner-shape": "var(--corner-shape, round)",
				"scrollbar-width": "var(--scrollbar-width, auto)",
				"scrollbar-color": "var(--scrollbar-color, auto)",
			},
			"*:hover": {
				"scrollbar-color": "var(--scrollbar-color-hover, var(--scrollbar-color, auto))",
			},
			"h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6": {
				"font-family": "var(--font-heading)",
				"font-weight": "var(--font-weight-heading, var(--font-weight-semibold))",
				"letter-spacing": "var(--tracking-heading, 0)",
			},
			body: {
				"@apply bg-bg font-sans text-fg": {},
			},
			":is([data-disabled], :disabled):not(:is([data-disabled], :disabled) *)": {
				opacity: "var(--disabled-opacity, 1)",
			},
			html: {
				"@apply font-sans": {},
			},
		},
		":root": {
			"--card-border": "var(--color-border)",
			"--overlay-border": "var(--color-border)",
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
			"--ease-enter": "cubic-bezier(0, 0, 0.2, 1)",
			"--transition-duration-enter": "200ms",
			"--transition-duration-exit": "150ms",
			"--default-transition-duration": "150ms",
			"--ease-fluid-out": "cubic-bezier(0.32, 0.72, 0, 1)",
			"--cursor-interactive": "pointer",
			"--cursor-pending": "default",
			"--cursor-disabled": "not-allowed",
			"--cursor-drag": "var(--cursor-interactive)",
			"--cursor-dragging": "var(--cursor-interactive)",
			"--focus-ring-color": "var(--color-border-focus)",
			"--focus-ring-width": "2px",
			"--focus-ring-offset": "2px",
			"--focus-ring-inner": "0px",
			"--focus-input-color": "var(--color-border-focus-muted)",
			"--focus-input-width": "2px",
			"--focus-input-offset": "0px",
			"--focus-input-inner": "0px",
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
		},
	},
} as const satisfies Pick<RegistryItem, "css" | "cssVars">;
