import { describe, expect, it } from "vitest";

import { DEFAULT_COLOR_CONFIG, type ColorConfig } from "@/registry/theme";

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

	it("drops a color recipe whose algorithm is not seed-generative (stale `fixed` preset)", () => {
		const bad = { ...DEFAULT_COLOR_CONFIG, algorithm: "fixed" } as unknown as ColorConfig;
		const encoded = encodePreset({ ...DEFAULTS, color: bad });
		expect(encoded).toBeTypeOf("string");
		expect(() => decodePreset(encoded ?? "")).not.toThrow();
		expect(decodePreset(encoded ?? "").color).toBeUndefined();
	});

	it("round-trips a config with per-producer knobs", () => {
		const custom = { ...DEFAULT_COLOR_CONFIG, knobs: { hueTorsion: 30, chromaMode: "max" as const } };
		const encoded = encodePreset({ ...DEFAULTS, color: custom });
		expect(encoded).toBeTypeOf("string");
		expect(decodePreset(encoded ?? "").color).toEqual(custom);
	});
});
