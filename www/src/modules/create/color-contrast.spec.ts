import { describe, expect, it } from "vitest";

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme";

import { solidContrastReport } from "./color-contrast";

describe("solidContrastReport", () => {
	it("reports text-on-solid contrast for every palette", () => {
		const report = solidContrastReport(resolveColorConfig(DEFAULT_COLOR_CONFIG));
		expect(report.map((r) => r.name).sort()).toEqual(["accent", "danger", "info", "neutral", "success", "warning"]);
	});

	it("the default palette's solid surfaces all clear WCAG AA (auto-foreground picks the readable pole)", () => {
		const report = solidContrastReport(resolveColorConfig(DEFAULT_COLOR_CONFIG));
		expect(report.every((r) => r.meets)).toBe(true);
		expect(report.every((r) => r.ratio >= 4.5)).toBe(true);
		expect(report.every((r) => r.level !== "fail")).toBe(true);
	});
});
