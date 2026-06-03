import { describe, expect, test } from "vitest";

import { cssToRegistryFields } from "./css-to-registry-fields";

describe("cssToRegistryFields", () => {
	test("keeps palette variables in css and theme variables in cssVars", () => {
		const fields = cssToRegistryFields(`
			@import "tw-animate-css";

			@plugin "tailwindcss-react-aria-components";

			@utility focus-ring {
				@apply ring-2 ring-border-focus;
			}

			@layer base {
				* {
					@apply border-border;
				}
				body {
					@apply bg-bg text-fg;
				}
			}

			::selection {
				background-color: var(--accent-800);
				color: var(--on-accent-800);
			}

			@theme {
				--color-bg: var(--neutral-50);
			}

			@theme inline {
				--radius-md: calc(0.375rem * var(--radius-factor));
			}

			:root {
				--neutral-50: hsl(0, 0%, 98%);
				--radius-factor: 1;
				color-scheme: light;
			}

			.dark {
				--neutral-50: hsl(0, 6%, 4%);
			}
		`);

		expect(fields.cssVars).toEqual({
			theme: {
				"--color-bg": "var(--neutral-50)",
				"--radius-md": "calc(0.375rem * var(--radius-factor))",
			},
		});
		expect(fields.css).toMatchObject({
			'@import "tw-animate-css"': {},
			'@plugin "tailwindcss-react-aria-components"': {},
			"@utility focus-ring": {
				"@apply ring-2 ring-border-focus": {},
			},
			"@layer base": {
				"*": {
					"@apply border-border": {},
				},
				body: {
					"@apply bg-bg text-fg": {},
				},
			},
			"::selection": {
				"background-color": "var(--accent-800)",
				color: "var(--on-accent-800)",
			},
			":root": {
				"--neutral-50": "hsl(0, 0%, 98%)",
				"--radius-factor": "1",
				"color-scheme": "light",
			},
			".dark": {
				"--neutral-50": "hsl(0, 6%, 4%)",
			},
		});
	});
});
