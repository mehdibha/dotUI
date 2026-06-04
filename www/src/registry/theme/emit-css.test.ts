import { describe, expect, it } from "vitest";

import { cssToRegistryFields } from "@/publisher/build-time/css-to-registry-fields";
import { baseRegistryCss } from "@/registry/__generated__/base-css";

import { emitCss } from "./emit-css";
import { DEFAULT_SEMANTICS } from "./semantics";

/** The `--color-*` subset of a cssVars.theme map (the part DEFAULT_SEMANTICS owns). */
function colorVars(vars: Record<string, string>): Record<string, string> {
	return Object.fromEntries(Object.entries(vars).filter(([key]) => key.startsWith("--color-")));
}

describe("DEFAULT_SEMANTICS ↔ base/theme.css parity", () => {
	it("emitCss reproduces today's --color-* vocabulary exactly", () => {
		const emitted = cssToRegistryFields(emitCss(DEFAULT_SEMANTICS));
		const got = colorVars(emitted.cssVars?.theme ?? {});
		const want = colorVars(baseRegistryCss.cssVars.theme as Record<string, string>);

		expect(got).toEqual(want);
	});

	it("covers every --color-* token the snapshot defines (no missing, no extra)", () => {
		const emitted = cssToRegistryFields(emitCss(DEFAULT_SEMANTICS));
		const gotKeys = Object.keys(colorVars(emitted.cssVars?.theme ?? {})).sort();
		const wantKeys = Object.keys(colorVars(baseRegistryCss.cssVars.theme as Record<string, string>)).sort();

		expect(gotKeys).toEqual(wantKeys);
	});
});
