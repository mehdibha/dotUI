import { describe, expect, it } from "vitest";

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme";

import { decodePreset, encodePreset } from "./codec";
import { DEFAULTS } from "./defaults";

describe("preset codec — color recipe", () => {
	it("omits the color recipe when it matches the default palette", () => {
		expect(encodePreset({ ...DEFAULTS, color: DEFAULT_COLOR_CONFIG })).toBeUndefined();
	});

	it("round-trips a custom color recipe through encode → decode", () => {
		const custom = {
			...DEFAULT_COLOR_CONFIG,
			seeds: { ...DEFAULT_COLOR_CONFIG.seeds, accent: "#ef4444" },
		};
		const encoded = encodePreset({ ...DEFAULTS, color: custom });
		expect(encoded).toBeTypeOf("string");
		expect(decodePreset(encoded ?? "").color).toEqual(custom);
	});

	it("decodes to an undefined color when the preset carries none", () => {
		const encoded = encodePreset({ ...DEFAULTS, density: "comfortable" });
		expect(decodePreset(encoded ?? "").color).toBeUndefined();
	});
});
